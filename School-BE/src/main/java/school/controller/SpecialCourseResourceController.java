package school.controller;

import java.util.List;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import school.dto.SpecialCourseResourse.SpecialCourseResourceRequestDTO;
import school.dto.SpecialCourseResourse.SpecialCourseResourceResponseDTO;
import school.dto.SpecialCourseResourse.SpecialCourseResourceUpdateDTO;
import school.services.*;

@RestController
@RequestMapping("/api/special-course-resources")
@RequiredArgsConstructor
public class SpecialCourseResourceController {

    private final SpecialCourseResourceService resourceService;


                //     CREATE RESOURCE
   

    @PostMapping(
        value = "/course/{courseId}",
        consumes = "multipart/form-data"
         )
public ResponseEntity<SpecialCourseResourceResponseDTO> createResource(

        @PathVariable Long courseId,

        @ModelAttribute
        SpecialCourseResourceRequestDTO request
) {

    return ResponseEntity.ok(

            resourceService.uploadResource(
                    courseId,
                    request
            )
    );
}
                   

                // GET ALL RESOURCES
    

    @GetMapping
    public ResponseEntity<List<SpecialCourseResourceResponseDTO>> getAllResources() {

        return ResponseEntity.ok(
                resourceService.getAllResources()
        );
    }


                //     GET RESOURCE BY ID
   

    @GetMapping("/{resourceId}")
    public ResponseEntity<SpecialCourseResourceResponseDTO> getResourceById(@PathVariable Long resourceId ) {

        return ResponseEntity.ok(
                resourceService.getResourceById(resourceId)
        );
    }

  
                // GET RESOURCES BY COURSE ID
    

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<SpecialCourseResourceResponseDTO>> getResourcesByCourseId(@PathVariable Long courseId) 
    {

        return ResponseEntity.ok(
                resourceService.getResourcesByCourseId(courseId)
        );
    }

                //view File

    @Operation(summary = "View image/video/pdf")
    @GetMapping("/view")
    public ResponseEntity<InputStreamResource> viewFile(
            @RequestParam Long resource_Id
    ) {

        return resourceService.viewFile(resource_Id);
    }

                //Download File


     @Operation(summary = "Download image/video/pdf")
    @GetMapping("/download")
    public ResponseEntity<InputStreamResource> downloadFile(
            @RequestParam Long resource_Id
    ) {

        return resourceService.downloadFile(resource_Id);
    }


                //     UPDATE RESOURCE
   

    @PutMapping(
            value = "/{resourceId}",
            consumes = "multipart/form-data"
    )
    public ResponseEntity<SpecialCourseResourceResponseDTO> updateResource(

            @PathVariable Long resourceId,

            @ModelAttribute
            SpecialCourseResourceUpdateDTO request

    ) {

        return ResponseEntity.ok(

                resourceService.updateResource(
                        resourceId,
                         request
                )
        );
    }

    
                //     DELETE RESOURCE
    

    @DeleteMapping("/{resourceId}")
    public ResponseEntity<String> deleteResource(

            @PathVariable Long resourceId
    ) {

        resourceService.deleteResource(resourceId);

        return ResponseEntity.ok(
                "Resource deleted successfully"
        );
    }
}