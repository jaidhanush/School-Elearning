package school.mapper;

import org.springframework.stereotype.Component;

import school.dto.SpecialCourseResourse.SpecialCourseResourceResponseDTO;
import school.models.SpecialCourseResource;


@Component
public class SpecialCourseResourceMapper {

     public SpecialCourseResourceResponseDTO toSpecialCourseResourceResponse(SpecialCourseResource resource) {

        SpecialCourseResourceResponseDTO dto = new SpecialCourseResourceResponseDTO();

        dto.setResourceId(resource.getResourceId());

        dto.setTitle(resource.getTitle());

        dto.setS3Key(resource.getS3Key() );

        dto.setResourceType(resource.getResourceType());

        dto.setSequenceNo(resource.getSequenceNo());

        dto.setPreviewAllowed( resource.getPreviewAllowed());

        dto.setCourseId(resource.getCourse().getCourseId());

        return dto;
    }
}
