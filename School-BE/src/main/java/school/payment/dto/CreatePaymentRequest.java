package school.payment.dto;

import lombok.Data;
import school.payment.enums.PaymentProvider;

import java.util.List;

@Data
public class CreatePaymentRequest {
    private List<String> courseIds;
    private PaymentProvider provider;
}