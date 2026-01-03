package school.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import school.models.Teacher;

@Repository
public interface TeacherRepo extends JpaRepository<Teacher, Long>{

}
