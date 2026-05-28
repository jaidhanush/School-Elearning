package school.dto.specialCourse;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SpecialCourseUpdate {
    
    @NotNull(message = "Course code is required")
    private String specialCourseCode;

    @NotNull(message = "Course name is required")
    private String specialCourseName;

    @NotNull(message = "Course description is required")
    private String specialCourseDesc;

    @NotNull(message = "Amount is required")
    private BigDecimal amount;
    
}
