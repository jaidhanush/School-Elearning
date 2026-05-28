package school.dto.student;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class StudentUpdateRequest {

   
    @NotBlank(message = "First name must not be blank")
    private String firstName;

    @NotBlank(message = "Last name must not be blank")          
    private String lastName;

    @Pattern(regexp = "^[0-9]{10}$")
    @NotBlank(message = "Phone number must be 10 digits")
    private String phoneNumber;

    @NotBlank(message = "Gender must not be blank") 
    private String gender;
}
