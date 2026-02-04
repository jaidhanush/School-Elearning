package school.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Profile("no-security")
@Configuration
public class NoSecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    	
    	

        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth ->
                auth.anyRequest().permitAll()
               
            ).headers(headers -> headers.frameOptions().disable());
        
        return http.build();
        
          
    }
    
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return NoOpPasswordEncoder.getInstance(); // ⚠️ ONLY for no-security
//    }
//    
//    @Bean
//    public AuthenticationManager authenticationManager() {
//        return authentication -> {
//            authentication.setAuthenticated(true);
//            return authentication;
//        };
//    }
}