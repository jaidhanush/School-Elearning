package school.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import school.dto.ResetPasswordDto;
import school.services.ForgotPasswordService;

@RestController
@RequestMapping("/api/users")
public class ForgotPasswordController {
	
	private final ForgotPasswordService service; 
	
	 public ForgotPasswordController(ForgotPasswordService service) {
	        this.service = service;
	    }
	 
	 @PostMapping("/forgetpassword")
	 public String ForgetPassword(@RequestBody Map<String,String> emailRequest)
	 {
		 service.sendOtp(emailRequest.get("email"));
	        return "OTP sent to email";
	 }
	 
	 @PostMapping("/forget-reset")
	 public String ResetPassword(@RequestBody ResetPasswordDto request)
	 {
		 return service.resetPassword(request);
	 }
	 

}
