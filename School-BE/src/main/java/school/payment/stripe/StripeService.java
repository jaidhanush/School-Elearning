package school.payment.stripe;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

import lombok.RequiredArgsConstructor;
import school.models.SpecialCourse;
import school.models.SpecialEnrollment;
import school.models.Students;
import school.payment.dto.CreatePaymentRequest;
import school.payment.enums.PaymentStatus;
import school.repository.SpecialCourseRepo;
import school.repository.SpecialEnrollmentRepo;
import school.repository.StudentRepo;
import school.security.SecurityUtil;

@Service
@RequiredArgsConstructor
public class StripeService {

    private final SpecialCourseRepo courseRepo;
    private final SpecialEnrollmentRepo enrollmentRepo;
    private final StudentRepo studentRepo;

    @Value("${frontend.success.url}")
    private String successUrl;

    @Value("${frontend.cancel.url}")
    private String cancelUrl;

    public Map<String, Object> createSession(CreatePaymentRequest request) throws Exception {

    Long user_id = SecurityUtil.getCurrentUserId();

    Students stud = studentRepo.findByUser_UserId(user_id)
            .orElseThrow(() -> new RuntimeException("Student not found with ID: " + user_id));

    Long studentId = stud.getStudentId();
 
    List<SpecialCourse> courses = courseRepo.findByCourseCodeIn(request.getCourseIds());

    if (courses.isEmpty()) {
        throw new RuntimeException("No courses found");
    }

    
    if (courses.size() != request.getCourseIds().size()) {
        throw new RuntimeException("Some course codes are invalid");
    }

    
    for (SpecialCourse course : courses) {

        SpecialEnrollment existing = enrollmentRepo
                .findByStudentStudentIdAndCourseCourseId(studentId, course.getCourseId())
                .orElse(null);

        if (existing == null) {
            SpecialEnrollment enrollment = new SpecialEnrollment();
            enrollment.setStudent(stud);
            enrollment.setCourse(course);
            enrollment.setPaid(false);
            enrollment.setPaymentStatus(PaymentStatus.PENDING);

            enrollmentRepo.save(enrollment);
        }
    }

    // Stripe line items
    List<SessionCreateParams.LineItem> lineItems = courses.stream()
            .map(course -> SessionCreateParams.LineItem.builder()
                    .setQuantity(1L)
                    .setPriceData(
                            SessionCreateParams.LineItem.PriceData.builder()
                                    .setCurrency("inr")
                                    .setUnitAmount(
                                            course.getAmount().multiply(new BigDecimal(100)).longValue()
                                    )
                                    .setProductData(
                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                    .setName(course.getCourseName())
                                                    .build()
                                    )
                                    .build()
                    )
                    .build())
            .toList();

    SessionCreateParams.Builder builder = SessionCreateParams.builder()
            .setMode(SessionCreateParams.Mode.PAYMENT)
            .setSuccessUrl(successUrl)
            .setCancelUrl(cancelUrl)
            .putMetadata("studentId", studentId.toString())
            .putMetadata("courseCodes", String.join(",", request.getCourseIds()));

    lineItems.forEach(builder::addLineItem);

    Session session = Session.create(builder.build());

    return Map.of("url", session.getUrl());
}

    
}
