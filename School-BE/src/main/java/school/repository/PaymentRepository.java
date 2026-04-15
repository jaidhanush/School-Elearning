package school.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school.models.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}