package school.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import school.dto.specialCourse.SpecialCourseRequest;
import school.dto.specialCourse.SpecialCourseResponse;
import school.dto.specialCourse.SpecialCourseUpdate;
import school.services.SpecialCourseService;

@RestController
@RequestMapping("/api/special-courses")
@RequiredArgsConstructor
public class SpecialCourseController {

    private final SpecialCourseService specialCourseService;


    @Operation(
		summary = "Get all Special Courses",
		description = "Retrieves a list of all special courses available in the system."
	)
    @GetMapping()
    public List<SpecialCourseResponse> getSpecialCourse()
    {
        return  specialCourseService.getSpecialCourse();
    }

    @Operation(
        summary = "Get special course by ID",
        description = "Retrieves a specific special course using its ID."
    )
    @GetMapping("course/{id}")
    public SpecialCourseResponse getSpecialCourseById(@PathVariable Long id) {
        return specialCourseService.getSpecialCourseById(id);
    }

    @Operation(
        summary = "Create a new special course",
        description = "Creates a new special course under a specific department."
    )
    @PostMapping("course/{dep_id}")
    public SpecialCourseResponse createSpecialCourse(@Valid @RequestBody SpecialCourseRequest request, @PathVariable Long dep_id) {

        return specialCourseService.createSpecialCourse(request, dep_id);

    }

  

    @Operation(
        summary = "Fully update special course",
        description = "Updates all fields of a special course."
    )
    @PutMapping("course/{id}")
    public SpecialCourseResponse updateSpecialCourse( @PathVariable Long id, @Valid @RequestBody SpecialCourseUpdate request) {

        return specialCourseService.updateSpecialCourse(id, request);
    }

    @Operation(
        summary = "Add teacher to special course",
        description = "Assigns a teacher to a special course."
    )
    @PutMapping("course/{course_id}/{teacher_id}")
    public SpecialCourseResponse addTeacherToSpecialCourse( @PathVariable Long course_id, @PathVariable Long teacher_id) {
        return specialCourseService.addTeacherToSpecialCourse(course_id, teacher_id);
    }

    @Operation(
        summary = "Delete special course",
        description = "Deletes a special course using ID."
    )
    @DeleteMapping("course/{id}")
    public String deleteSpecialCourse(@PathVariable Long id) {
        return  specialCourseService.deleteSpecialCourse(id);
         
    }



    
    
}
