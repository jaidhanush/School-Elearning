package school.dto.department;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class DepartmentPatchRequest {

    private String departmentName;

    private String description;

    @Email(message = "Invalid email format")
    private String email;


}
