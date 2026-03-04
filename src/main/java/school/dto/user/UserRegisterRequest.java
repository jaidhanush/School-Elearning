package school.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserRegisterRequest {

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;
    
  

}
