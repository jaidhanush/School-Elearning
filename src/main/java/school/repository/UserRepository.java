package school.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import school.models.Users;

public interface UserRepository extends JpaRepository<Users, Long> {

    Optional<Users> findByEmail(String email);
}
