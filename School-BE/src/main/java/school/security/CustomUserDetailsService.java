package school.security;


import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import school.models.Users;
import school.repository.UserRepository;


@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository  userRepo;


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Users user = userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

       return new CustomUserDetails(
                user.getUserId(),
                user.getEmail(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
        );
}
}