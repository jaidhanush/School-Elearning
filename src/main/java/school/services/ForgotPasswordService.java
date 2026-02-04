package school.services;

import java.time.LocalDateTime;
import java.util.Random;


import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import school.config.EmailService;
import school.dto.ResetPasswordDto;
import school.models.PasswordReset;
import school.models.Users;
import school.repository.PasswordResetRepository;
import school.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class ForgotPasswordService {
	
	 private final UserRepository userRepo;
	    private final PasswordResetRepository otpRepo;
	    private final EmailService emailService;
	    private final PasswordEncoder passwordEncoder;


	    // STEP 1: SEND OTP
	    public void sendOtp(String email) {

	        userRepo.findByEmail(email)
	                .orElseThrow(() -> new RuntimeException("User not found"));

	        String otp = String.valueOf(100000 + new Random().nextInt(900000));

	        PasswordReset otpvalue= new PasswordReset(); 
	        otpvalue.setEmail(email);
	        otpvalue.setOtp(otp);
	        otpvalue.setExpiryTime(LocalDateTime.now().plusMinutes(5));
	        otpvalue.setUsed(false);

	        otpRepo.save(otpvalue);

	        emailService.sendHtmlMail(
	                email,
	                "Password Reset OTP",
	                otp
	        );
	    }

	    // STEP 2: VERIFY OTP + RESET PASSWORD
	    public String resetPassword(ResetPasswordDto request) {

	        PasswordReset otpEntity = otpRepo
	                .findTopByEmailOrderByExpiryTimeDesc(request.getEmail())
	                .orElseThrow(() -> new RuntimeException("OTP not found"));

	        if (otpEntity.isUsed()) {
	            throw new RuntimeException("OTP already used");
	        }

	        if (otpEntity.getExpiryTime().isBefore(LocalDateTime.now())) {
	            throw new RuntimeException("OTP expired");
	        }

	        if (!otpEntity.getOtp().equals(request.getOtp())) {
	            throw new RuntimeException("Invalid OTP");
	        }

	        Users user = userRepo.findByEmail(request.getEmail())
	                .orElseThrow(() -> new RuntimeException("User not found"));

	        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
	        userRepo.save(user);

	        otpEntity.setUsed(true);
	        otpRepo.save(otpEntity);
	        
	        return "reset Password Successfully";
	    }

}
