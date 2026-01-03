package school.security;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Profile("security")
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.csrf(csrf -> csrf.disable())
                .sessionManagement(sess ->
                        sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth

                        // =======================
                        // 🔐 AUTH MODULE
                        // =======================
                		
                        .requestMatchers(HttpMethod.POST, "/api/users/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/users/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/users/refresh").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/users/forgetpassword").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/users/forget-reset").permitAll()
                        .requestMatchers("/h2-console/**","/login/**").permitAll()
//                        .requestMatchers(HttpMethod.GET, "/api/auth/profile").authenticated()
//                        .requestMatchers(HttpMethod.POST, "/api/auth/logout").authenticated()

                        // =======================
                        // 👶 STUDENT MODULE
                        // =======================
                        .requestMatchers(HttpMethod.POST, "/api/students/register").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/students/{id}")
                                .hasAnyRole("ADMIN", "STUDENT")
                        .requestMatchers(HttpMethod.PUT, "/api/students/{id}")
                                .hasAnyRole("ADMIN", "STUDENT")
                        .requestMatchers(HttpMethod.DELETE, "/api/students/{id}")
                                .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/students")
                                .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/students/{id}/enrollments")
                                .hasAnyRole("ADMIN", "STUDENT")
                        .requestMatchers(HttpMethod.GET, "/api/students/{id}/courses/available")
                                .hasRole("STUDENT")

                        // =======================
                        // 📚 COURSE MODULE
                        // =======================
                        .requestMatchers(HttpMethod.POST, "/api/courses").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/courses").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/courses/{id}").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/courses/{id}")
                                .hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers(HttpMethod.DELETE, "/api/courses/{id}")
                                .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/courses/{id}/assign-teacher/{teacherId}")
                                .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/courses/{id}/students")
                                .hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers(HttpMethod.GET, "/api/courses/{id}/enrollments")
                                .hasAnyRole("ADMIN", "TEACHER")

                        // =======================
                        // 👨‍🏫 TEACHER MODULE
                        // =======================
                        .requestMatchers(HttpMethod.POST, "/api/teachers").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/teachers").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/teachers/{id}")
                                .hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers(HttpMethod.PUT, "/api/teachers/{id}")
                                .hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers(HttpMethod.DELETE, "/api/teachers/{id}")
                                .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/teachers/{id}/courses")
                                .hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers(HttpMethod.GET, "/api/teachers/{id}/courses/{courseId}/roster")
                                .hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers(HttpMethod.POST, "/api/teachers/{id}/courses/{courseId}/grades")
                                .hasRole("TEACHER")
                        .requestMatchers(HttpMethod.POST, "/api/teachers/{id}/courses/{courseId}/attendance")
                                .hasRole("TEACHER")
                        .requestMatchers(HttpMethod.GET, "/api/teachers/{id}/courses/{courseId}/reports")
                                .hasRole("TEACHER")

                        // =======================
                        // 📝 ENROLLMENT MODULE
                        // =======================
                        .requestMatchers(HttpMethod.POST, "/api/enrollments")
                                .hasRole("STUDENT")
                        .requestMatchers(HttpMethod.GET, "/api/enrollments")
                                .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/enrollments/{id}")
                                .hasAnyRole("ADMIN", "STUDENT", "TEACHER")
                        .requestMatchers(HttpMethod.PUT, "/api/enrollments/{id}/cancel")
                                .hasRole("STUDENT")
                        .requestMatchers(HttpMethod.PUT, "/api/enrollments/{id}/approve")
                                .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/enrollments/{id}/instructor-approve")
                                .hasRole("TEACHER")
                        .requestMatchers(HttpMethod.PUT, "/api/enrollments/{id}/status")
                                .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/enrollments/course/{courseId}")
                                .hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers(HttpMethod.GET, "/api/enrollments/student/{studentId}")
                                .hasAnyRole("ADMIN", "STUDENT")

                        // =======================
                        // 🏫 DEPARTMENT MODULE
                        // =======================
                        .requestMatchers(HttpMethod.POST, "/api/departments")
                                .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/departments").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/departments/{id}").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/departments/{id}")
                                .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/departments/{id}")
                                .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/departments/{id}/courses").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/departments/{id}/teachers").permitAll()

                        // =======================
                        // 👑 ADMIN MODULE
                        // =======================
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // =======================
                        // 🔚 DEFAULT PROTECTION
                        // =======================
                        .anyRequest().authenticated()
                ).headers(headers -> headers.frameOptions().disable())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Required for password hashing
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Required for authenticationManager.authenticate(...)
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
