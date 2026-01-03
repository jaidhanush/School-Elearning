package school.dto;

import lombok.Data;
import school.models.Teacher;

@Data
public class DepartmentDto {
	
	private Long departmentId;
    private String departmentName;
    private String description;
    private String headOfDepartment;
    private String email;

}
