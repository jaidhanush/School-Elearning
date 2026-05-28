package school.dto.PasswordRequest;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class resetPasswordRequest {

    @NotBlank
    private String OldPassword;


    @NotBlank
    @Pattern(
    regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$",
    message = "Password must contain uppercase, lowercase, number and special character"
    )
    private String resetPassword1;


    @NotBlank 
    @Pattern(
    regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$",
    message = "Password must contain uppercase, lowercase, number and special character"
    )  
    private String resetPassword2;
}
