package school.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ResetPasswordDto {

		@Email(message = "Invalid email format")
	    @NotBlank(message = "Email cannot be blank")
	 	private String email;

	    private String otp;

		@Pattern(
	    regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$",
	    message = "Password must contain uppercase, lowercase, number and special character"
	    )	
		@NotBlank(message = "New password cannot be blank")
		@Schema(example = "Password must contain uppercase, lowercase, number and special character")
	    private String newPassword;

}
