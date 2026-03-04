package school.dto.department;

import lombok.Data;


@Data
public class DepartmentResponse {
	
	private Long departmentId;
    private String departmentName;
    private String description;
    private String headOfDepartment;
    private String email;

}
