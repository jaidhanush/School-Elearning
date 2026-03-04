package school.dto.teacher;


import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import school.dto.user.UserRegisterRequest;


@Data
public class TeacherCreateRequest {
	
	
	@NotBlank
	private String name;  
	
	@NotBlank
	private String gender;  
	
	@Valid
	private UserRegisterRequest user;
	
}
