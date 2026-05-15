package school.payment.stripe;

import com.stripe.model.checkout.Session;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import school.models.SpecialEnrollment;
import school.payment.enums.PaymentProvider;
import school.payment.enums.PaymentStatus;
import school.models.Payment;
import school.models.SpecialCourse;
import school.repository.SpecialEnrollmentRepo;
import school.repository.PaymentRepository;
import school.repository.SpecialCourseRepo;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StripePaymentService {

    private final SpecialEnrollmentRepo specialEnrollmentRepo;
    private final PaymentRepository paymentRepo; 
    private final SpecialCourseRepo courseRepo;


    public void handlePaymentSuccess(Session session) {

        Long studentId = Long.valueOf(session.getMetadata().get("studentId"));
        String courseIdsStr = session.getMetadata().get("courseCodes");

        List<String> courseIds = Arrays.stream(courseIdsStr.replaceAll("[\\[\\]\\s]", "").split(","))
                .toList();

        // Update enrollments
        for (String courseId : courseIds) {

            SpecialCourse specialCourse = courseRepo.findByCourseCode(courseId)
                    .orElseThrow(() -> new RuntimeException("Course not found: " + courseId));

            SpecialEnrollment specialEnrollment = specialEnrollmentRepo
                    .findByStudentStudentIdAndCourseCourseId(studentId, specialCourse.getCourseId()).orElse(null);

            if (specialEnrollment != null) {
                specialEnrollment.setPaid(true);
                specialEnrollment.setPaymentStatus(PaymentStatus.SUCCESS);
                specialEnrollment.setPaymentId(session.getId());
                specialEnrollment.setEnrolledAt(LocalDateTime.now());

                specialEnrollmentRepo.save(specialEnrollment);
            }
        }

        // Save payment history
        Payment payment = new Payment();
        payment.setStudentId(studentId);
        payment.setPaymentId(session.getId());
        payment.setCourseIds(courseIdsStr);
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setProvider(PaymentProvider.STRIPE);
        payment.setTotalAmount(
                              BigDecimal.valueOf(session.getAmountTotal())
                            .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP)
                            );
       

        paymentRepo.save(payment);
    }
}