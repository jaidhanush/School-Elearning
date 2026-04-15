package school.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import school.models.SpecialCourse;

@Repository
public interface SpecialCourseRepo extends JpaRepository<SpecialCourse, Long> {

   List<SpecialCourse> findByCourseCodeIn(List<String> courseCodes);

   Optional<SpecialCourse> findByCourseCode(String courseCode);
}
