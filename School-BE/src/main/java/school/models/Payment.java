package school.models;

import jakarta.persistence.*;
import lombok.*;
import school.payment.enums.PaymentProvider;
import school.payment.enums.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long studentId;

    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;
    
     @Enumerated(EnumType.STRING)
    private PaymentProvider provider;

    // ✅ Common fields
    private String paymentId;   // Stripe sessionId OR Razorpay paymentId
    private String orderId;     

    private String courseIds; // store as comma-separated

    private LocalDateTime paymentDate;
    
}