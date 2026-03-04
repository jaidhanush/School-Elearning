package school.services;


import java.util.HashMap;
import java.util.List;
import java.util.Map;


import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;



import school.dto.PasswordRequest.resetPasswordRequest;
import school.dto.user.UserRegisterRequest;
import school.models.Users;
import school.repository.UserRepository;
import school.security.CustomUserDetailsService;
import school.security.JwtService;

@Service
@RequiredArgsConstructor
public class UserService  {

	 private final AuthenticationManager authManager;
	    private final UserRepository userRepo;
	    private final PasswordEncoder encoder;
	    private final JwtService jwtService;
	    private final CustomUserDetailsService userDetailsService;


	    // ---------------- REGISTER ----------------
	    public Map<String, String> register(UserRegisterRequest user) {

	        if (userRepo.findByEmail(user.getEmail()).isPresent()){
	            throw new RuntimeException("Email already exists");
	        }

	        Users user1 = new Users(
	                null,
	                user.getEmail(),
	               encoder.encode(
	                user.getPassword()),
	                "ADMIN" // Default role, can be changed later by an admin
	        );

	        userRepo.save(user1);

	        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());

	        Map<String, String> tokens = new HashMap<>();
	        tokens.put("accessToken", jwtService.generateAccessToken(userDetails));
	        tokens.put("refreshToken", jwtService.generateRefreshToken(userDetails));

	        return tokens;
	    }

	    // ---------------- LOGIN ----------------
	    public Map<String, String> login(String email, String password) {

			userRepo.findByEmail(email)
	                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

	        authManager.authenticate(
	                new UsernamePasswordAuthenticationToken(email, password)
	        );

	        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

	        Map<String, String> tokens = new HashMap<>();
	        tokens.put("accessToken", jwtService.generateAccessToken(userDetails));
	        tokens.put("refreshToken", jwtService.generateRefreshToken(userDetails));

	        return tokens;
	    }

	    // ---------------- REFRESH TOKEN ----------------
	    public Map<String, String> refresh(String refreshToken) {

	        String username = jwtService.extractUsername(refreshToken);

	        if (!jwtService.isRefreshToken(refreshToken)) {
	            throw new RuntimeException("Invalid refresh token");
	        }

	        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

	        Map<String, String> tokens = new HashMap<>();
	        tokens.put("accessToken", jwtService.generateAccessToken(userDetails));
	        tokens.put("refreshToken", jwtService.generateRefreshToken(userDetails));

	        return tokens;
	    }


	    // -----------------------------------------------------
	    //                EXTRA CRUD FUNCTIONS
	    // -----------------------------------------------------

	    // ---------------- GET ALL USERS ----------------
	    public List<Users> getAllUsers() {
	        return userRepo.findAll();
	    }

	    // ---------------- UPDATE USER (PUT) ----------------
	   
	    // ---------------- DELETE USER ----------------
	    public String deleteUser(Long id,String email) {

	        Users user = userRepo.findById(id)
	                .orElseThrow(() -> new RuntimeException("User not found"));

	        if (user.getEmail().equals(email)) {
	            throw new RuntimeException("You cannot delete your own account");
	        }

	        userRepo.delete(user);

	        return "User deleted successfully";
	    }

	public String resetPassword(resetPasswordRequest request,String email) {
			 
			Users user = userRepo.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("User not found"));



    if (!encoder.matches(request.getOldPassword(), user.getPassword())) {
        throw new RuntimeException("Old password is incorrect");
    }

    if (!request.getResetPassword1().equals(request.getResetPassword2())) {
        throw new RuntimeException("New passwords do not match");
    }

    if (encoder.matches(request.getResetPassword1(), user.getPassword())) {
        throw new RuntimeException("New password cannot be same as old password");
    }

    // if (!PasswordValidator.isStrong(request.getResetPassword1())) {
    //     throw new BadRequestException("Password does not meet security requirements");
    // }

    	user.setPassword(encoder.encode(request.getResetPassword1()));
    	userRepo.save(user);

		return "Password changed successfully";
		        
	    }

		
}
