package school.dto.teacher;


import lombok.Data;

@Data
public class TeacherPatchRequest {
	
	private String name;  
	
	private String gender; 

	private Long departmentId;	
	
}
