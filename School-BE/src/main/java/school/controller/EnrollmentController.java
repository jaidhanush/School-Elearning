package school.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import school.dto.enrollment.EnrollmentResponse;
import school.services.EnrollmentService;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @Operation(
        summary = "Get all enrollments",
        description = "Retrieves a list of all enrollments available in the system."
    )
    @GetMapping
    public List<EnrollmentResponse>  getAllEnrollments() {
        return enrollmentService.getAllEnrollments();
    }
    
    @Operation(
        summary = "Get enrollment by ID",
        description = "Retrieves a specific enrollment by its ID."
    )
    @GetMapping("/{enroll_id}")
    public EnrollmentResponse  getAllEnrollmentsById(@PathVariable long enroll_id) {
    	return enrollmentService.getAllEnrollmentsById(enroll_id);
    }
    
    @Operation(
        summary = "Get enrollments by course",
        description = "Retrieves all enrollments for a specific course."
    )   
    @GetMapping("/course/{courseId}")
    public List<EnrollmentResponse> getEnrollmentByCourse(@PathVariable long courseId) {
    	return enrollmentService.getEnrollmentByCourse(courseId);
    }
    
    @Operation(
        summary = "Get enrollments by student",
        description = "Retrieves all enrollments for a specific student."
    )
    @GetMapping("/student/{studId}")
    public List<EnrollmentResponse> getEnrollmentByStudent(@PathVariable long studId) {
    	return enrollmentService.getEnrollmentByStudent(studId);
    }
    
    
    @Operation(
        summary = "Enroll a student in a course",
        description = "Enrolls a student in a specific course using the student ID and course ID."
    )
    @PostMapping("/{studentId}/{courseId}")
    public EnrollmentResponse enrollStudent(@PathVariable Long studentId,
                                    @PathVariable Long courseId) {
        return enrollmentService.enrollStudent(studentId, courseId);
    }
    

    @Operation(
        summary = "Update instructor approval for an enrollment",
        description = "Updates the instructor approval status for a specific enrollment using the enrollment ID and the new approval status."
    )   
    //  APPROVED ,WAITLISTED, REJECTED
    @PutMapping("/{id}/{approvalStatus}")
    public EnrollmentResponse updateInstructorApproval(@PathVariable Long id,
                                               @PathVariable String approvalStatus) {
        return enrollmentService.updateInstructorApproval(id, approvalStatus);
    }

   
    
    @Operation(     
        summary = "Delete an enrollment",
        description = "Deletes a specific enrollment from the system using the enrollment ID."
    )
    @DeleteMapping("/{id}")
    public String deleteEnrollment(@PathVariable Long id) {
        enrollmentService.deleteEnrollment(id);
        return "Enrollment deleted successfully!";
    }
}
