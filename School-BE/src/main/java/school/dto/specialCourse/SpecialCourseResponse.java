package school.dto.specialCourse;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class SpecialCourseResponse {
    private Long specialCourseId;
    private String specialCourseCode;
    private String specialCourseName;
    private String specialCourseDesc;
    private BigDecimal amount;

    private Long departmentId;
    private String departmentName;

    private Long teacherId;
    private String teacherName;
}
