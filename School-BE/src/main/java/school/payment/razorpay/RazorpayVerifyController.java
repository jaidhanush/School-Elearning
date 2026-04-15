package school.payment.razorpay;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@Slf4j
public class RazorpayVerifyController {

    private final RazorpayPaymentService paymentService;

    @Value("${payment.razorpay.keySecret}")
    private String keySecret;

    // ✅ No @Transactional here — transaction is managed in the service layer
    @PostMapping("/razorpay/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> body) {
        String orderId   = body.get("razorpay_order_id");
        String paymentId = body.get("razorpay_payment_id");
        String signature = body.get("razorpay_signature");

          // 👇 ADD THESE
         log.info("=== /razorpay/verify called ===");
         log.info("orderId={}, paymentId={}, signature={}", orderId, paymentId, signature);

        try {
            // Razorpay signature = HMAC-SHA256(orderId + "|" + paymentId, keySecret)
            String data = orderId + "|" + paymentId;

            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(keySecret.getBytes(), "HmacSHA256"));
            byte[] hash = mac.doFinal(data.getBytes());

            // Convert to hex
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) sb.append(String.format("%02x", b));
            String generated = sb.toString();

            if (generated.equals(signature)) {
                // ✅ Payment is genuine — delegate to service
                paymentService.handleVerifiedPayment(orderId, paymentId);
                return ResponseEntity.ok(Map.of("success", true, "paymentId", paymentId));
            } else {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "error", "Invalid signature"));
            }

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "error", e.getMessage()));
        }
    }
}