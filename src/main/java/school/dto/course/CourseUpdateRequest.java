package school.dto.course;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;


@Data
public class CourseUpdateRequest {
	
	@NotBlank
    private String courseCode;

    @NotBlank
    private String courseName;

    @NotBlank
    private String courseDesc;

    @NotNull
    private Long departmentId;

    @NotNull
    private Long teacherId;
}
