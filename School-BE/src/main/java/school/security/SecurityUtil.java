package school.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtil {

    public static Long getCurrentUserId() {
       Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();
        return user.getUserId();
    }
}
