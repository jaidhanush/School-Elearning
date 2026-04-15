package school.payment.stripe;

import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class StripeWebhookController {

private final StripePaymentService paymentService;

@Value("${stripe.webhook.secret}")
private String secret;

@PostMapping("/webhook")
public ResponseEntity<String> webhook(@RequestBody String payload,
                                      @RequestHeader("Stripe-Signature") String sigHeader) {

    try {

        System.out.println("SECRET = " + secret);

        Event event = Webhook.constructEvent(payload, sigHeader, secret);

        System.out.println("Event Type: " + event.getType());

        if ("checkout.session.completed".equals(event.getType())) {

            var deserializer = event.getDataObjectDeserializer();
            Session session = (Session) deserializer.deserializeUnsafe();

            paymentService.handlePaymentSuccess(session);
        }

        return ResponseEntity.ok("Success");

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.badRequest().body("Webhook Error: " + e.getMessage());
    }
}
}