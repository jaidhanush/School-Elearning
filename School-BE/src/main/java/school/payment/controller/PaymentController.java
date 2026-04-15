package school.payment.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import school.payment.dto.CreatePaymentRequest;
import school.payment.service.PaymentService;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payment")
public class PaymentController {

    
    private final PaymentService paymentService;

    @PostMapping("/create-session")
    public Map<String, Object> createPayment(@RequestBody CreatePaymentRequest request) throws Exception {
        return paymentService.createPayment(request);
    }
}