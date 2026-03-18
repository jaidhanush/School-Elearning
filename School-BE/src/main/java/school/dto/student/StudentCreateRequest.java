package school.dto.student;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import school.dto.user.UserRegisterRequest;


@Data
public class StudentCreateRequest {

    @NotBlank(message = "First name must not be blank")
    private String firstName;

    @NotBlank(message = "Last name must not be blank")
    private String lastName;
    
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits")
    private String phoneNumber;
    
    @NotBlank(message = "Gender must not be blank")
    private String gender;
    
    @Valid
    private UserRegisterRequest user;
}
