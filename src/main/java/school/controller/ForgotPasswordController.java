package school.controller;


import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import school.dto.PasswordRequest.ForgetPasswordRequest;
import school.dto.response.ResetPasswordDto;
import school.services.ForgotPasswordService;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class ForgotPasswordController {
	
	private final ForgotPasswordService service; 
	
	 
	 @Operation(
		        summary = "Initiate password reset",
		        description = "Sends an OTP to the user's email address to initiate the password reset process. The request must contain a valid email."
		    )
	 @PostMapping("/forgetpassword")
	 public String ForgetPassword(@Valid @RequestBody ForgetPasswordRequest emailRequest)
	 {
		 service.sendOtp(emailRequest.getEmail());
	        return "OTP sent to email";
	 }
	 
	 @Operation(
		        summary = "Reset password",
		        description = "Resets the user's password using the provided OTP and new password. The request must contain a valid email, OTP, and new password."
		    )
	 @PostMapping("/forget-reset")
	 public String ResetPassword(@RequestBody ResetPasswordDto request)
	 {
		 return service.resetPassword(request);
	 }
	 

}
