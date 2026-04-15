package school.dto.specialCourse;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class SpecialCourseUpdate {
 
    private String specialCourseCode;
    private String specialCourseName;
    private String specialCourseDesc;
    private BigDecimal amount;
    
}
