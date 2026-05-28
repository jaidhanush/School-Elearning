package school.controller;

import java.util.List;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
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


            
   
  @Operation(
		summary = "Post new  Special Courses Resource",
		description = "Create new special course resource for a specific course."
	)
    @PostMapping( value = "/course/{courseId}",consumes = "multipart/form-data" )
public ResponseEntity<SpecialCourseResourceResponseDTO> createResource( @PathVariable Long courseId, @Valid @ModelAttribute
        SpecialCourseResourceRequestDTO request) 
        {
          return ResponseEntity.ok( resourceService.uploadResource(courseId, request ));
        }
                   

                // GET ALL RESOURCES

 @Operation(
		summary = "Get all the Special Courses Resources",
		description = "Retrieve all special course resources available in the system."
	)               

    @GetMapping
    public ResponseEntity<List<SpecialCourseResourceResponseDTO>> getAllResources() {

        return ResponseEntity.ok(
                resourceService.getAllResources()
        );
    }


                //     GET RESOURCE BY ID
   

 @Operation(
		summary = "Get the Special Courses Resources By ID",
		description = "Retrieve a specific special course resource by its ID."
	)  
    @GetMapping("/{resourceId}")
    public ResponseEntity<SpecialCourseResourceResponseDTO> getResourceById(@PathVariable Long resourceId ) {

        return ResponseEntity.ok(
                resourceService.getResourceById(resourceId)
        );
    }

  
                // GET RESOURCES BY COURSE ID
    
    
    @Operation(
		summary = "Get Special Courses Resources by Course ID",
		description = "Retrieve all special course resources for a specific course."
	)
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
    public ResponseEntity<InputStreamResource> viewFile( @RequestParam Long resource_Id ) {

        return resourceService.viewFile(resource_Id);
    }

                //Download File


     @Operation(summary = "Download image/video/pdf")
    @GetMapping("/download")
    public ResponseEntity<InputStreamResource> downloadFile( @RequestParam Long resource_Id) {

        return resourceService.downloadFile(resource_Id);
    }


                //     UPDATE RESOURCE
   
     @Operation(
		summary = "Update the Special Courses Resources",
		description = "update the Special course resources for a specific course."
	)
    @PutMapping(  value = "/{resourceId}", consumes = "multipart/form-data")
    public ResponseEntity<SpecialCourseResourceResponseDTO> updateResource(@PathVariable Long resourceId, @Valid @ModelAttribute
            SpecialCourseResourceUpdateDTO request) {

        return ResponseEntity.ok( resourceService.updateResource(resourceId, request ) );
    }

    
                //     DELETE RESOURCE
    
     @Operation(
		summary = "Delete Special Courses Resources",
		description = "Delete a specific special course resource by its ID."
	)
    @DeleteMapping("/{resourceId}")
    public ResponseEntity<String> deleteResource( @PathVariable Long resourceId ) {
       
        resourceService.deleteResource(resourceId);

        return ResponseEntity.ok( "Resource deleted successfully");
    }
}