package school.mapper;

import org.springframework.stereotype.Component;

import school.dto.EnrollmentDto;
import school.models.Enrollment;

@Component
public class EnrollmentMapper {
	
    public  EnrollmentDto enrolltoDto(Enrollment enrollment) {
        EnrollmentDto enrolldto = new EnrollmentDto();

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

}
