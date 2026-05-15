package school.services;

import java.util.List;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;

import school.dto.SpecialCourseResourse.SpecialCourseResourceRequestDTO;
import school.dto.SpecialCourseResourse.SpecialCourseResourceResponseDTO;
import school.dto.SpecialCourseResourse.SpecialCourseResourceUpdateDTO;

public interface SpecialCourseResourceService {

   
                    // UPLOAD RESOURCE
    
    SpecialCourseResourceResponseDTO uploadResource(
            Long courseId,
        SpecialCourseResourceRequestDTO request
    );


                    // UPDATE RESOURCE


    SpecialCourseResourceResponseDTO updateResource(
            Long resourceId,
            SpecialCourseResourceUpdateDTO request
    );


        // GET ALL RESOURCES
    

    List<SpecialCourseResourceResponseDTO>
    getAllResources();


         // GET RESOURCE BY ID

    SpecialCourseResourceResponseDTO
    getResourceById(Long resourceId);

    
       // GET RESOURCES BY COURSE ID
    

    List<SpecialCourseResourceResponseDTO>
    getResourcesByCourseId(Long courseId);

  
                    // DELETE RESOURCE
    

    void deleteResource(Long resourceId);

    ResponseEntity<InputStreamResource> viewFile(Long resource_Id);


    ResponseEntity<InputStreamResource> downloadFile(Long resource_Id);
}