package school.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school.models.SpecialEnrollment;

import java.util.List;
import java.util.Optional;

public interface SpecialEnrollmentRepo extends JpaRepository<SpecialEnrollment, Long> {

    Optional<SpecialEnrollment> findByStudentStudentIdAndCourseCourseId(
             Long studentId,
             Long courseId);

    List<SpecialEnrollment>findByStudentStudentId(Long studentId);
}