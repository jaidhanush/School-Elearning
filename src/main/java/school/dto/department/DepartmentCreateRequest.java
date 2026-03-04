package school.dto.department;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DepartmentCreateRequest {


    @NotBlank(message = "Department name must not be blank")
    private String departmentName;

    @NotBlank(message = "Description must not be blank")
    private String description;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email must not be blank")
    private String email;

    @NotNull(message = "Head of Department teacher ID is required")
    private Long headOfDepartmentId;
}
