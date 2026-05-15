package school.dto.SpecialCourseResourse;

import org.springframework.web.multipart.MultipartFile;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class SpecialCourseResourceRequestDTO {

    private String title;

    private Boolean previewAllowed;

    private Integer sequenceNo;

    private MultipartFile file;
}