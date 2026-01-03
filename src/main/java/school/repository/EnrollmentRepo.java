package school.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import school.models.Course;
import school.models.Enrollment;
import school.models.Students;

@Repository
public interface EnrollmentRepo extends JpaRepository<Enrollment, Long> {
	 boolean existsByCourseAndStudent(Course course, Students student);
}
