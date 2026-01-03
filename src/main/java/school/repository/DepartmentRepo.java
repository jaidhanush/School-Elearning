package school.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import school.models.Department;

@Repository
public interface DepartmentRepo extends JpaRepository<Department, Long>{

}
