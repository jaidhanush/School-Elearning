package school.payment.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import school.payment.dto.CreatePaymentRequest;
import school.payment.enums.PaymentProvider;
import school.payment.razorpay.RazorpayService;
import school.payment.stripe.StripeService;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final StripeService stripeService;

    private final RazorpayService razorpayService;

    public Map<String, Object> createPayment(CreatePaymentRequest request) throws Exception {

        if (request.getProvider() == PaymentProvider.STRIPE) {
            return stripeService.createSession(request);
        } else if (request.getProvider() == PaymentProvider.RAZORPAY) {
            return razorpayService.createOrder(request);
        }

        throw new RuntimeException("Invalid payment provider");
    }
}