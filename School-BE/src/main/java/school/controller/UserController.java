package school.controller;

import java.util.List;
import java.util.Map;


import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import school.dto.PasswordRequest.resetPasswordRequest;
import school.dto.user.UserLoginRequest;
import school.dto.user.UserRegisterRequest;
import school.dto.user.UserResponse;
import school.models.Users;
import school.services.UserService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;

   
   @PostMapping("/register")
@Operation(
    summary = "Register a new user",
    description = "Creates a new user account in the system. The request must contain a valid email and password. Email must be unique."
)
public UserResponse createUser(@Valid @RequestBody UserRegisterRequest user) {
    return service.register(user);
}


@GetMapping
@Operation(
    summary = "Get all users",
    description = "Retrieves a list of all registered users from the system."
)
public List<Users> getAllUsers() {
    return service.getAllUsers();
}


@DeleteMapping("/delete/{id}")
@Operation(
    summary = "Delete user by ID",
    description = "Deletes a user from the system using the provided user ID. The currently logged-in user cannot delete their own account."
)
public String deleteUser(@PathVariable Long id,
                         @AuthenticationPrincipal UserDetails userDetails) {

    return service.deleteUser(id, userDetails.getUsername());
}


@PostMapping("/login")
@Operation(
    summary = "User login",
    description = "Authenticates a user using email and password. If the credentials are valid, the system returns a JWT token."
)
public UserResponse login(@Valid @RequestBody UserLoginRequest user) {
    return service.login(user.getEmail(), user.getPassword());
}


@PostMapping("/change-password")
@Operation(
    summary = "Change user password",
    description = "Allows the currently authenticated user to change their password by providing the old password and new password."
)
public String changePassword(
        @AuthenticationPrincipal UserDetails userDetails,
        @Valid @RequestBody resetPasswordRequest request) {

    service.resetPassword(request, userDetails.getUsername());

    return "Password changed successfully";
 
}

}