package school.dto.specialCourse;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SpecialCourseRequest {

    private String specialCourseCode;
    private String specialCourseName;
    private String specialCourseDesc;

    private BigDecimal amount;
   

    
}
