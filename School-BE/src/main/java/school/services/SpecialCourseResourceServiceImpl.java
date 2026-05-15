package school.services;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

import school.Enum.ResourceType;
import school.dto.SpecialCourseResourse.SpecialCourseResourceRequestDTO;
import school.dto.SpecialCourseResourse.SpecialCourseResourceResponseDTO;
import school.dto.SpecialCourseResourse.SpecialCourseResourceUpdateDTO;
import school.mapper.SpecialCourseResourceMapper;
import school.models.SpecialCourse;
import school.models.SpecialCourseResource;
import school.repository.SpecialCourseRepo;
import school.repository.SpecialCourseResourceRepository;
import school.storage.FileStorageService;

@Service
@RequiredArgsConstructor
public class SpecialCourseResourceServiceImpl
        implements SpecialCourseResourceService {

    private final SpecialCourseResourceRepository resourceRepository;

    private final SpecialCourseRepo courseRepository;

    private final FileStorageService fileStorageService;

    private final SpecialCourseResourceMapper resourceMapper;

   
                //     UPLOAD RESOURCE
 

    @Override
public SpecialCourseResourceResponseDTO uploadResource(
        Long courseId,
        SpecialCourseResourceRequestDTO request
) {

    try {

        SpecialCourse course =
                courseRepository.findById(courseId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Course not found"
                                )
                        );

        ResourceType resourceType =
                getResourceType(
                        request.getFile().getContentType()
                );

        String s3Key =
                fileStorageService.uploadFile(
                        request.getFile(),
                        "special-course-resources/"+resourceType
                );

        SpecialCourseResource resource =
                new SpecialCourseResource();

        resource.setTitle(
                request.getTitle()
        );

        resource.setPreviewAllowed(
                request.getPreviewAllowed()
        );

        resource.setSequenceNo(
                request.getSequenceNo()
        );

        resource.setS3Key(s3Key);

        resource.setResourceType(resourceType);

        resource.setCourse(course);

        SpecialCourseResource savedResource =
                resourceRepository.save(resource);

        return resourceMapper.toSpecialCourseResourceResponse(savedResource);

    } catch (IOException e) {

        throw new RuntimeException(
                "File upload failed"
        );
    }
}


        @Override
        public ResponseEntity<InputStreamResource> viewFile(Long resource_Id) {  
                
                SpecialCourseResource resource = resourceRepository.findById(resource_Id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Resource not found"
                        )
                );

                return fileStorageService.viewFile(resource.getS3Key());
        }


        @Override
        public ResponseEntity<InputStreamResource> downloadFile(Long resource_Id) {
                SpecialCourseResource resource = resourceRepository.findById(resource_Id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Resource not found"
                                )
                        );
                return fileStorageService.downloadFile(resource.getS3Key());
        }

                //     UPDATE RESOURCE
 

    @Override
    public SpecialCourseResourceResponseDTO updateResource( Long resourceId, SpecialCourseResourceUpdateDTO request ) {

        try {

            SpecialCourseResource resource =
                    resourceRepository.findById(resourceId)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Resource not found"
                                    )
                            );

            
                //     DELETE OLD FILE
            

            fileStorageService.deleteFile(
                    resource.getS3Key()
            );

            ResourceType resourceType =
                getResourceType(
                        request.getFile().getContentType()
                );

       
                //     UPLOAD NEW FILE
            
            String newS3Key =
                    fileStorageService.uploadFile(
                            request.getFile(),
                            "special-course-resources/"+resourceType
                    );

            
                //     UPDATE DATA
            

            resource.setTitle(request.getTitle());
            resource.setPreviewAllowed(request.getPreviewAllowed());
            resource.setSequenceNo(request.getSequenceNo());

            resource.setS3Key(newS3Key);

            resource.setResourceType(resourceType);

            SpecialCourseResource updatedResource =
                    resourceRepository.save(resource);

            return resourceMapper.toSpecialCourseResourceResponse(updatedResource);

        } catch (IOException e) {

            throw new RuntimeException(
                    "Resource update failed"
            );
        }
    }

    

                    // GET ALL RESOURCES
    

    @Override
    public List<SpecialCourseResourceResponseDTO>
    getAllResources() {

        return resourceRepository.findAll()
                .stream()
                .map(resourceMapper::toSpecialCourseResourceResponse)
                .collect(Collectors.toList());
    }

  
                //     GET RESOURCE BY ID
   

    @Override
    public SpecialCourseResourceResponseDTO getResourceById( Long resourceId
) {

        SpecialCourseResource resource =
                resourceRepository.findById(resourceId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Resource not found"
                                )
                        );

        return resourceMapper.toSpecialCourseResourceResponse(resource);
    }

    
                //     GET RESOURCES BY COURSE ID
    

    @Override
    public List<SpecialCourseResourceResponseDTO>
    getResourcesByCourseId(
            Long courseId
    ) {

        return resourceRepository
                .findByCourseCourseId(courseId)
                .stream()
                .map(resourceMapper::toSpecialCourseResourceResponse)
                .collect(Collectors.toList());
    }

   
                //     DELETE RESOURCE
  

    @Override
    public void deleteResource(  Long resourceId) {

        SpecialCourseResource resource =
                resourceRepository.findById(resourceId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Resource not found"
                                )
                        );

    
                //     DELETE FILE
       

        fileStorageService.deleteFile(
                resource.getS3Key()
        );

     
       
                //     DELETE DB RECORD
       

        resourceRepository.delete(resource);
    }

   

   

    /*
    ============================================================
                DETERMINE RESOURCE TYPE
    ============================================================
     */

    private ResourceType getResourceType(
            String contentType
    ) {

        if (contentType == null) {
            return ResourceType.OTHER;
        }

        if (contentType.startsWith("video")) {
            return ResourceType.VIDEO;
        }

        if (contentType.equals("application/pdf")) {
            return ResourceType.PDF;
        }

        if (contentType.startsWith("image")) {
            return ResourceType.IMAGE;
        }

        return ResourceType.OTHER;
    }
}