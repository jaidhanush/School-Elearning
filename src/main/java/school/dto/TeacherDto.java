package school.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeacherDto {
	
    private Long teacherId;
    private String name;
    private String gender;
    private Long userId;
    private String userMail;
    private Long departmentId;
    private String departmentName;
    
//    private List<CourseDto> courses;
}
