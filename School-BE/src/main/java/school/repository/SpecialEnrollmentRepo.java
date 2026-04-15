package school.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school.models.SpecialEnrollment;

import java.util.List;

public interface SpecialEnrollmentRepo extends JpaRepository<SpecialEnrollment, Long> {

    SpecialEnrollment findByStudentIdAndCourse_CourseId(Long studentId, Long courseId);

    List<SpecialEnrollment> findByStudentId(Long studentId);
}