package school.dto.department;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import school.validation.ValidEmailDomain;


@Data
public class DepartmentUpdateRequest {

    @NotBlank(message = "Department name must not be blank")
    private String departmentName;

    @NotBlank(message = "Description must not be blank")
    private String description;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email must not be blank")
    @ValidEmailDomain(message = "Email domain must be one of: gmail.com, yahoo.com, outlook.com")
    private String email;

    
}
