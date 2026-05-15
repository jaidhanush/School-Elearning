package school.dto.SpecialCourseResourse;


import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class SpecialCourseResourceUpdateDTO {

     @NotBlank(message = "Title is required")
    private String title;

    @Positive(message = "Sequence number must be greater than 0")
    private Integer sequenceNo;

    @NotNull(message = "Preview allowed field is required")
    private Boolean previewAllowed;

    
    private MultipartFile file;
}
