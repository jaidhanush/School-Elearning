package school.dto.course;

import jakarta.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class CourseCreateRequest{

    @NotBlank(message = "Course code must not be blank")
    private String courseCode;

    @NotBlank(message = "Course name must not be blank")        
    private String courseName;

    @NotBlank(message = "Course description must not be blank")
    private String courseDesc;


}