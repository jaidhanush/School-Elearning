package school.dto.teacher;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TeacherUpdateRequest {
	
	@NotBlank
	private String name;  
	
	@NotBlank
	private String gender; 

	@NotNull
	private Long departmentId;	
}
