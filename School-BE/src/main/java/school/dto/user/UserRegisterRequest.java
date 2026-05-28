package school.dto.user;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import school.validation.ValidEmailDomain;

@Data
public class UserRegisterRequest {

    @Email(message = "Invalid email format")
    @ValidEmailDomain(message = "Email domain must be one of: gmail.com, yahoo.com, outlook.com")
    @NotBlank(message = "Email must not be blank")
    @Schema(example = "demo@gmail.com")
    private String email;

    @NotBlank(message = "Password must not be blank")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(
    regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$",
    message = "Password must contain uppercase, lowercase, number and special character"
    )
    @Schema(example = "Demo@123")
    private String password;
    
  

}
