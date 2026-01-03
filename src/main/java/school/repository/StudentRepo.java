package school.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import school.models.Students;

@Repository
public interface StudentRepo extends JpaRepository<Students, Long> {

}
