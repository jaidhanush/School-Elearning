package school.dto.PasswordRequest;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class resetPasswordRequest {

    @NotBlank
    private String OldPassword;
    @NotBlank
    private String resetPassword1;
    @NotBlank   
    private String resetPassword2;
}
