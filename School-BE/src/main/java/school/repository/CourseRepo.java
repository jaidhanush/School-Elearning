package school.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import school.models.Course;

@Repository
public interface CourseRepo extends JpaRepository<Course, Long>{
	boolean existsByCourseCodeAndDepartment_DepartmentId(String courseCode, Long departmentId);

}
