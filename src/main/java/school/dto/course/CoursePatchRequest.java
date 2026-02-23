package school.dto.course;

import lombok.Data;

@Data
public class CoursePatchRequest {


    private String courseCode;
    private String courseName;
    private String courseDesc;

    private Long departmentId;
    private Long teacherId;
}
