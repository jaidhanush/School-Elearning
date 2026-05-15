package school.models;

import jakarta.persistence.*;
import lombok.*;
import school.payment.enums.PaymentStatus;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"studentId", "course_id"})
})
public class SpecialEnrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Students student;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private SpecialCourse course;

    private boolean isPaid;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    private String paymentId; // Stripe session id

    private LocalDateTime enrolledAt;
}