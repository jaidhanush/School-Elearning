package school.config;

import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApiGroupingConfig {

    @Bean
    public GroupedOpenApi studentApi() {
        return GroupedOpenApi.builder()
                .group("Student APIs")
                .pathsToMatch("/api/students/**")
                .build();
    }

    @Bean
    public GroupedOpenApi courseApi() {
        return GroupedOpenApi.builder()
                .group("Course APIs")
                .pathsToMatch("/api/courses/**")
                .build();
    }

    @Bean
    public GroupedOpenApi enrollmentApi() {
        return GroupedOpenApi.builder()
                .group("Enrollment APIs")
                .pathsToMatch("/api/enrollments/**")
                .build();
    }

    @Bean
    public GroupedOpenApi deptApi() {
        return GroupedOpenApi.builder()
                .group("Department APIs")
                .pathsToMatch("/api/departments/**")
                .build();
    }
    
    @Bean
    public GroupedOpenApi teachApi() {
    	return GroupedOpenApi.builder()
    			.group("Teacher APIs")
    			.pathsToMatch("/api/teachers/**")
    			.build();
    }
    @Bean
    public GroupedOpenApi userApi() {
    	return GroupedOpenApi.builder()
    			.group("User APIs")
    			.pathsToMatch("/api/users/**")
    			.build();
    }
 	
}