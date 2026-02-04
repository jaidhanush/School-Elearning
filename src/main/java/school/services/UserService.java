package school.services;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.catalina.User;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;

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

//	    public UserService(AuthenticationManager authManager,
//	    		    		UserRepository userRepo,
//	                       PasswordEncoder encoder,
//	                       JwtService jwtService,
//	                       CustomUserDetailsService userDetailsService) {
//
//	        this.authManager = authManager;
//	        this.userRepo = userRepo;
//	        this.encoder = encoder;
//	        this.jwtService = jwtService;
//	        this.userDetailsService = userDetailsService;
//	    }

	    // ---------------- REGISTER ----------------
	    public Map<String, String> register(Users user) {

	        if (userRepo.findByEmail(user.getEmail()).isPresent()){
	            throw new RuntimeException("Email already exists");
	        }

	        Users user1 = new Users(
	                null,
	                user.getEmail(),
	               encoder.encode(
	                user.getPassword()),
	                user.getRole()
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
	    public String deleteUser(Long id) {

	        Users user = userRepo.findById(id)
	                .orElseThrow(() -> new RuntimeException("User not found"));

	        userRepo.delete(user);

	        return "User deleted successfully";
	    }

	    public String resetPassword(Map<String, String> request) {
			 Authentication authentication = SecurityContextHolder
		                .getContext()
		                .getAuthentication();

		        String username = authentication.getName(); // email from token

		        Users user = userRepo.findByEmail(username)
		                .orElseThrow(() -> new RuntimeException("User Not Found"));

		        // 🔐 2️⃣ Validate request fields
		        String oldPassword = request.get("password");
		        String newPassword1 = request.get("resetPassword1");
		        String newPassword2 = request.get("resetPassword2");

		        if (oldPassword == null || newPassword1 == null || newPassword2 == null) {
		            return "Missing required fields";
		        }

		        // 🔐 3️⃣ Verify old password (encrypted)
		        if (!encoder.matches(oldPassword, user.getPassword())) {
		            return "please entered correct old password";
		        }

		        // 🔐 4️⃣ Check new password match
		        if (!newPassword1.equals(newPassword2)) {
		            return "New password Mismatch";
		        }

		        // 🔐 5️⃣ Encode & save new password
		        user.setPassword(encoder.encode(newPassword1));
		        userRepo.save(user);

		        return "Password reset successfully";
		        
	    }

		public String forgetPassword(Map<String, String> request) {
			Users user=userRepo.findByEmail(request.get("email")).orElseThrow(()->new RuntimeException(" User Not Found"));
			return null;
		}
}
