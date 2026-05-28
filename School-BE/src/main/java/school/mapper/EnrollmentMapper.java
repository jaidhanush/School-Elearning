package school.mapper;

import org.springframework.stereotype.Component;

import school.Enum.ApprovalStatus;
import school.dto.enrollment.EnrollmentResponse;
import school.models.Course;
import school.models.Enrollment;
import school.models.Students;

@Component
public class EnrollmentMapper {
	
    public  EnrollmentResponse enrolltoDto(Enrollment enrollment) {
        EnrollmentResponse enrolldto = new EnrollmentResponse();

        enrolldto.setEnrollmentId(enrollment.getEnrollmentId());
        enrolldto.setEnrollmentDate(enrollment.getEnrollmentDate());
        enrolldto.setStatus(enrollment.getStatus());
        enrolldto.setInstructorApprovalStatus(enrollment.getInstructorApprovalStatus());

  
        if (enrollment.getCourse() != null) {
            enrolldto.setCourseId(enrollment.getCourse().getCourseId());
            enrolldto.setCourseName(enrollment.getCourse().getCourseName());
        }


        if (enrollment.getStudent() != null) {
            enrolldto.setStudentId(enrollment.getStudent().getStudentId());
            enrolldto.setStudentName(enrollment.getStudent().getFirstName());
        }

        return enrolldto;
    }

   public Enrollment toEnrollEntity(
        Students student,
        Course course) {

    Enrollment enroll = new Enrollment();

    enroll.setStudent(student);
    enroll.setCourse(course);

    enroll.setStatus("PENDING");

    enroll.setInstructorApprovalStatus(
            ApprovalStatus.PENDING);

    return enroll;
}

}
