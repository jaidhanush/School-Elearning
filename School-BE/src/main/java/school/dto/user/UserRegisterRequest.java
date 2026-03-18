package school.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import school.validation.ValidEmailDomain;

@Data
public class UserRegisterRequest {

    @Email(message = "Invalid email format")
    @ValidEmailDomain
    @NotBlank(message = "Email must not be blank")
    private String email;

    @NotBlank
    private String password;
    
  

}
