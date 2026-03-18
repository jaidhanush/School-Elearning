package school.dto.student;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class StudentUpdateRequest {

   
    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @Pattern(regexp = "^[0-9]{10}$")
    private String phoneNumber;

    @NotBlank
    private String gender;
}
