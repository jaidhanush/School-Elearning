package school.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import school.dto.EnrollmentDto;
import school.models.Enrollment;
import school.services.DepartmentService;
import school.services.EnrollmentService;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;


    @GetMapping
    public List<EnrollmentDto>  getAllEnrollments() {
        return enrollmentService.getAllEnrollments();
    }
    
    @GetMapping("/{enroll_id}")
    public EnrollmentDto  getAllEnrollmentsById(@PathVariable long enroll_id) {
    	return enrollmentService.getAllEnrollmentsById(enroll_id);
    }
    
    @GetMapping("/course/{courseId}")
    public List<EnrollmentDto> getEnrollmentByCourse(@PathVariable long courseId) {
    	return enrollmentService.getEnrollmentByCourse(courseId);
    }
    
    
    @GetMapping("/student/{studId}")
    public List<EnrollmentDto> getEnrollmentByStudent(@PathVariable long studId) {
    	return enrollmentService.getEnrollmentByStudent(studId);
    }
    
    


    @PostMapping("/{studentId}/{courseId}")
    public EnrollmentDto enrollStudent(@PathVariable Long studentId,
                                    @PathVariable Long courseId) {
        return enrollmentService.enrollStudent(studentId, courseId);
    }
    
//    @PutMapping("/{id}/cancel")
//    public EnrollmentDto StudentCancel(@PathVariable Long id) {
//    	return enrollmentService.studentCancel(id);
//    }
    

    // ENROLLED, WAITLISTED, DROPPED
//    @PutMapping("/{id}/status/{status}")
//    public EnrollmentDto updateStatus(@PathVariable Long id, @PathVariable String status) {
//        return enrollmentService.updateEnrollmentStatus(id, status);
//    }

    //  APPROVED ,WAITLISTED, REJECTED
    @PutMapping("/{id}/{approvalStatus}")
    public EnrollmentDto updateInstructorApproval(@PathVariable Long id,
                                               @PathVariable String approvalStatus) {
        return enrollmentService.updateInstructorApproval(id, approvalStatus);
    }

   
    
    
    @DeleteMapping("/{id}")
    public String deleteEnrollment(@PathVariable Long id) {
        enrollmentService.deleteEnrollment(id);
        return "Enrollment deleted successfully!";
    }
}
