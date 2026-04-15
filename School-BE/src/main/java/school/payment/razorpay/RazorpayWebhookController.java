// package school.payment.razorpay;
// import com.razorpay.Utils;
// import lombok.RequiredArgsConstructor;
// import org.json.JSONObject;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// @RestController
// @RequestMapping("/api/payment")
// @RequiredArgsConstructor
// public class RazorpayWebhookController {

//     private final RazorpayPaymentService paymentService;

//     @Value("${razorpay.webhook.secret}")
//     private String secret;

//  @PostMapping("/razorpay/webhook")
// public ResponseEntity<String> handleWebhook(
//         @RequestHeader("X-Razorpay-Signature") String signature,
//         @RequestBody String payload) {

//     try {
//         if (!verifyWebhook(payload, signature)) {
//             return ResponseEntity.badRequest().body("Invalid signature");
//         }

//         JSONObject event = new JSONObject(payload);
//         String eventType = event.getString("event");

//         JSONObject entity = event
//                 .getJSONObject("payload")
//                 .getJSONObject("payment")
//                 .getJSONObject("entity");

//         String paymentId = entity.getString("id");
//         String orderId = entity.getString("order_id");

//         if ("payment.captured".equals(eventType)) {
//             paymentService.handleVerifiedPayment(orderId, paymentId);
//         }

//         if ("payment.failed".equals(eventType)) {
//             paymentService.handleFailedPayment(orderId, paymentId);
//         }

//         return ResponseEntity.ok("OK");

//     } catch (Exception e) {
//         return ResponseEntity.internalServerError().body("Error");
//     }
// }
// }