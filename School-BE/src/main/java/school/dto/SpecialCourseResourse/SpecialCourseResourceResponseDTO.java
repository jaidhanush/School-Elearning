package school.dto.SpecialCourseResourse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import school.Enum.ResourceType;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SpecialCourseResourceResponseDTO {

    private Long resourceId;

    private String title;

    private String s3Key;

    private ResourceType resourceType;

    private Integer sequenceNo;

    private Boolean previewAllowed;

    private Long courseId;

    private String courseName;
}