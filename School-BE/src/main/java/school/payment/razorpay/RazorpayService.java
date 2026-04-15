package school.payment.razorpay;

import com.razorpay.*;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import school.models.SpecialCourse;
import school.payment.dto.CreatePaymentRequest;
import school.repository.SpecialCourseRepo;
import school.security.SecurityUtil;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RazorpayService {

    @Value("${payment.razorpay.keyId}")
    private String keyId;

    @Value("${payment.razorpay.keySecret}")
    private String keySecret;

    private final SpecialCourseRepo courseRepo;

    public Map<String, Object> createOrder(CreatePaymentRequest request) {

        List<SpecialCourse> courses = courseRepo.findByCourseCodeIn(request.getCourseIds());

        if (courses.isEmpty()) {
            throw new RuntimeException("No courses found");
        }

        BigDecimal totalAmount = courses.stream()
                .map(SpecialCourse::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        try {
            RazorpayClient client = new RazorpayClient(keyId, keySecret);

            // ✅ JSON ARRAY (NO STRING CONVERSION)
            JSONArray courseArray = new JSONArray(request.getCourseIds());

            JSONObject notes = new JSONObject();
            notes.put("studentId", String.valueOf(SecurityUtil.getCurrentUserId()));
            notes.put("courseCodes", courseArray);

            JSONObject options = new JSONObject();
            options.put("amount", totalAmount.multiply(BigDecimal.valueOf(100))); // paise
            options.put("currency", "INR");
            options.put("receipt", "order_" + System.currentTimeMillis());
            options.put("notes", notes);

            Order order = client.orders.create(options);

            Map<String, Object> response = new HashMap<>();
            response.put("orderId", order.get("id"));
            response.put("key", keyId);
            response.put("amount", order.get("amount"));

            return response;

        } catch (Exception e) {
            throw new RuntimeException("Razorpay order creation failed", e);
        }
    }
}