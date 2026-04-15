package school.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import school.models.Students;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepo extends JpaRepository<Students, Long> {

   void deleteByUserEmail(String email);



    Optional<Students> findByUser_UserId(Long userId);
}
