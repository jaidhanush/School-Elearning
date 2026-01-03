package school.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import school.models.PasswordReset;
import school.models.Users;


@Repository
public interface PasswordResetRepository extends JpaRepository<PasswordReset, Long>{
	
	Optional<Users> findByEmail(String email);

	Optional<PasswordReset> findTopByEmailOrderByExpiryTimeDesc(String email);

}
