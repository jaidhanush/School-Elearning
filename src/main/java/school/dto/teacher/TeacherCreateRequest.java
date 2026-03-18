package school.dto.teacher;


import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import school.dto.user.UserRegisterRequest;


@Data
public class TeacherCreateRequest {
	
	
	@NotBlank
	private String name;  
	
	@NotBlank
	private String gender;  

	@NotNull
	private Long departmentId;
	
	@Valid
	private UserRegisterRequest user;

	
	
}
