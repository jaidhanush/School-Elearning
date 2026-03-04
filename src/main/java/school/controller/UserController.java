package school.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import school.dto.PasswordRequest.resetPasswordRequest;
import school.dto.user.UserLoginRequest;
import school.dto.user.UserRegisterRequest;
import school.models.Users;
import school.security.CustomUserDetailsService;
import school.services.UserService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;

   
    @PostMapping("/register")
    public Map<String, String> createUser(@Valid @RequestBody UserRegisterRequest user) {
        return service.register(user);
    }
    
    @GetMapping
    public List<Users> getAllUsers()
    {
    	return service.getAllUsers();
    }

  
//    @GetMapping("/{id}")
//    public Users getUser(@PathVariable long id) {
//        return service.getUser(id);
//    }

    // GET USER BY EMAIL
//    @GetMapping("/email/{email}")
//    public Users getUserByEmail(@PathVariable String email) {
//        return service.getByEmail(email);
//    }

    // UPDATE USER
//    @PutMapping("/{id}")
//    public Users update(@PathVariable long id, @RequestBody Users user) {
//        return service.updateUser(id, user);
//    }

    // DELETE USER
    @DeleteMapping("/delete/{id}")
    public String deleteUser(@PathVariable Long id,
                            @AuthenticationPrincipal UserDetails userDetails) {

        return service.deleteUser(id, userDetails.getUsername());
    }

    // LOGIN
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody UserLoginRequest user) {
        return service.login(user.getEmail(), user.getPassword());
    }
    
    @PostMapping("/change-password")
    public String  changePassword(
        @AuthenticationPrincipal UserDetails userDetails,
        @Valid @RequestBody resetPasswordRequest request) {

    service.resetPassword(request, userDetails.getUsername());

    return "Password changed successfully";
    }
    
 
}
