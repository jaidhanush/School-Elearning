package school.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
	
	 
	 
	 @PostMapping("/forgetpassword")
	 public String ForgetPassword(@Valid @RequestBody ForgetPasswordRequest emailRequest)
	 {
		 service.sendOtp(emailRequest.getEmail());
	        return "OTP sent to email";
	 }
	 
	 @PostMapping("/forget-reset")
	 public String ResetPassword(@RequestBody ResetPasswordDto request)
	 {
		 return service.resetPassword(request);
	 }
	 

}
