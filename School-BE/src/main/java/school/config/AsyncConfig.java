package school.config;

import java.util.concurrent.Executor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
public class AsyncConfig {

    @Bean(name = "fileUploadExecutor")
    public Executor fileUploadExecutor() {

        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();

        // Minimum threads always alive
        executor.setCorePoolSize(5);

        // Maximum threads allowed
        executor.setMaxPoolSize(10);

        // Waiting queue
        executor.setQueueCapacity(100);

        // Thread name
        executor.setThreadNamePrefix("S3-Upload-");

        // Graceful shutdown
        executor.setWaitForTasksToCompleteOnShutdown(true);

        executor.initialize();

        return executor;
    }
}