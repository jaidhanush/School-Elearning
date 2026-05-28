package school.payment.razorpay;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import school.models.Payment;
import school.models.SpecialCourse;
import school.models.SpecialEnrollment;
import school.models.Students;
import school.payment.enums.PaymentProvider;
import school.payment.enums.PaymentStatus;
import school.repository.PaymentRepository;
import school.repository.SpecialCourseRepo;
import school.repository.SpecialEnrollmentRepo;
import school.repository.StudentRepo;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RazorpayPaymentService {

    private static final Logger log = LoggerFactory.getLogger(RazorpayPaymentService.class);

    private final SpecialEnrollmentRepo enrollmentRepo;
    private final PaymentRepository paymentRepo;
    private final SpecialCourseRepo courseRepo;
    private final StudentRepo studentRepo;

    @Value("${payment.razorpay.keyId}")
    private String keyId;

    @Value("${payment.razorpay.keySecret}")
    private String keySecret;

    @Transactional
    public void handleVerifiedPayment(String orderId, String paymentId) {

        try {
            RazorpayClient client = new RazorpayClient(keyId, keySecret);

            Order order = client.orders.fetch(orderId);
            JSONObject notes = order.get("notes");

            Long user_id = Long.valueOf(notes.getString("studentId"));


            Students stud = studentRepo.findByUser_UserId(user_id)
            .orElseThrow(() -> new RuntimeException("Student not found with ID: " + user_id));

          Long studentId = stud.getStudentId();
 


            // ✅ READ JSON ARRAY
            JSONArray arr = notes.getJSONArray("courseCodes");

            List<String> courseCodes = new ArrayList<>();
            for (int i = 0; i < arr.length(); i++) {
                courseCodes.add(arr.getString(i));
            }

            log.info("Payment verified for studentId={} courses={}", studentId, courseCodes);

            // ✅ Process each course
            for (String code : courseCodes) {

                SpecialCourse course = courseRepo.findByCourseCode(code)
                        .orElseThrow(() -> new RuntimeException("Course not found: " + code));

                SpecialEnrollment enrollment =
                        enrollmentRepo.findByStudentStudentIdAndCourseCourseId(studentId, course.getCourseId()).orElse(null);

                // ❌ Already paid check
                if (enrollment != null && Boolean.TRUE.equals(enrollment.isPaid())) {
                    log.warn("⚠️ Already purchased: {}", code);
                    continue; // skip duplicate
                }

                if (enrollment == null) {
                    enrollment = new SpecialEnrollment();
                    enrollment.setStudent(stud);
                    enrollment.setCourse(course);
                }

                // ✅ Update enrollment
                enrollment.setPaid(true);
                enrollment.setPaymentStatus(PaymentStatus.SUCCESS);
                enrollment.setPaymentId(paymentId);
                enrollment.setEnrolledAt(LocalDateTime.now());

                enrollmentRepo.save(enrollment);

                log.info("✅ Enrollment updated for {}", code);
            }

            // ✅ Fetch payment amount
            com.razorpay.Payment rzpPayment = client.payments.fetch(paymentId);
            int amount = rzpPayment.get("amount");

            // ✅ Save payment history
            Payment payment = new Payment();
            payment.setStudentId(studentId);
            payment.setPaymentId(paymentId);
            payment.setOrderId(orderId);
            payment.setCourseIds(String.join(",", courseCodes)); // optional
            payment.setStatus(PaymentStatus.SUCCESS);
            payment.setPaymentDate(LocalDateTime.now());
            payment.setProvider(PaymentProvider.RAZORPAY);
            payment.setTotalAmount(
                    BigDecimal.valueOf(amount)
                            .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP)
            );

            paymentRepo.save(payment);

            log.info("💰 Payment saved successfully");

        } catch (Exception e) {
            log.error("Payment handling failed", e);
            throw new RuntimeException("Payment failed", e);
        }
    }
}