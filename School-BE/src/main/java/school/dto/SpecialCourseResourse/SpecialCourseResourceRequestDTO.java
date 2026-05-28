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
public class SpecialCourseResourceRequestDTO {
    
    @NotBlank(message = "Title must not be blank")
    private String title;

    @NotNull(message = "Preview allowed must not be blank")
    private Boolean previewAllowed;

    @Positive(message = "Sequence number must be greater than 0")
    private Integer sequenceNo;

   @NotNull(message = "File is required")
    private MultipartFile file;
}