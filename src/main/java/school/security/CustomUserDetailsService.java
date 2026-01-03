package school.security;


import org.springframework.stereotype.Service;

import org.springframework.security.core.userdetails.*;
import school.models.Users;
import school.repository.UserRepository;


@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository  userRepo;

    public CustomUserDetailsService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Users user = userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return User.withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole()) // "ADMIN", "STUDENT", "TEACHER"
                .build();
    }
}