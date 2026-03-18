package school.services;

import java.util.List;



import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import school.dto.enrollment.EnrollmentResponse;
import school.mapper.EnrollmentMapper;
import school.models.*;
import school.repository.*;

@Service
@Transactional
@RequiredArgsConstructor
public class EnrollmentService {


    private final EnrollmentRepo enrollmentRepo;

    private final StudentRepo studentRepo;

    private final CourseRepo courseRepo;
 
    private final EnrollmentMapper enrollmentMapper;

    // 🔹 Get all enrollments
    public List<EnrollmentResponse> getAllEnrollments() {
          return enrollmentRepo.findAll()
                .stream()
                .map(enrollmentMapper::enrolltoDto)
                .toList();
    }

    // 🔹 Enroll a student in a course
    public EnrollmentResponse enrollStudent(Long studentId, Long courseId) {
        Students student = studentRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + studentId));

        Course course = courseRepo.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + courseId));
        
        if(enrollmentRepo.existsByCourseAndStudent(course, student))
        {
        	throw  new RuntimeException("Student Enrolled This Course Already");
        }
        
        if(course.getEnrollments().size()>=3)
        {
        	throw  new RuntimeException("Course Seats are filled Maximum");
        }
        
        if(student.getEnrollments().size()>=2)
        {
        	throw  new RuntimeException("Student Already Enrolled the Maximum Courses");
        }

        if(student.getDepartment().getDepartmentId()!=course.getDepartment().getDepartmentId())
        {
        	throw  new RuntimeException("Student Department and Course Department are not same");
        }

        Enrollment enroll= enrollmentMapper.toEnrollEntity(student, course);
        
         Enrollment saved= enrollmentRepo.save(enroll);
        return enrollmentMapper.enrolltoDto(saved);
    }

    // 🔹 Update enrollment status (ENROLLED, DROPPED, COMPLETED)
//    public EnrollmentDto updateEnrollmentStatus(Long id, String status) {
//        Enrollment enrollment = enrollmentRepo.findById(id)
//                .orElseThrow(() -> new RuntimeException("Enrollment not found with ID: " + id));
//
//        enrollment.setStatus(status);
//         enrollmentRepo.save(enrollment);
//         return mapper.enrolltoDto(enrollment);
//    }

    // 🔹 Update instructor approval (APPROVED / REJECTED)
    public EnrollmentResponse updateInstructorApproval(Long enroll_id, String approvalStatus) {
        Enrollment enrollment = enrollmentRepo.findById(enroll_id)
                .orElseThrow(() -> new RuntimeException("Enrollment not found with ID: " + enroll_id));
        
        
        if(approvalStatus!=null)
        {
        	
        	enrollment.setInstructorApprovalStatus(approvalStatus);
        	
        	if(approvalStatus.equalsIgnoreCase("Approved"))
        	{
        		enrollment.setStatus("ENROLLED");
        	}
        	else if(approvalStatus.equalsIgnoreCase("Rejected"))
        	{
        		enrollment.setStatus("DROPPED");
        	}
        }

        
        enrollmentRepo.save(enrollment);
        return enrollmentMapper.enrolltoDto(enrollment);
    }

    // 🔹 Delete enrollment record
    public void deleteEnrollment(Long id) {
        if (!enrollmentRepo.existsById(id))
            throw new RuntimeException("Enrollment not found with ID: " + id);

        enrollmentRepo.deleteById(id);
    }

	public EnrollmentResponse studentCancel(Long id) {
		Enrollment enrollment = enrollmentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Enrollment not found with ID: " + id));
		
		
		enrollment.setStatus("Cancel");
		return enrollmentMapper.enrolltoDto(enrollment);
	}

	public List<EnrollmentResponse> getEnrollmentByCourse(long courseId) {
		Course course = courseRepo.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + courseId));

		return course.getEnrollments().stream()
				.map(enrollmentMapper::enrolltoDto)
				.toList();
	}
	
	public List<EnrollmentResponse> getEnrollmentByStudent(long studId) {
		Students student = studentRepo.findById(studId)
				.orElseThrow(() -> new RuntimeException("Student not found with ID: " + studId));
		
		return student.getEnrollments().stream()
				.map(enrollmentMapper::enrolltoDto)
				.toList();
	}

	public EnrollmentResponse getAllEnrollmentsById(long enroll_id) {
		 Enrollment enrollment = enrollmentRepo.findById(enroll_id)
                .orElseThrow(() -> new RuntimeException("Enrollment not found with ID: " + enroll_id));
		 return enrollmentMapper.enrolltoDto(enrollment);
	}
}