package school.dto.response;

import lombok.Data;


@Data
public class DepartmentDto {
	
	private Long departmentId;
    private String departmentName;
    private String description;
    private String headOfDepartment;
    private String email;

}
