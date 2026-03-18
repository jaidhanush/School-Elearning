package school.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;


@Documented
@Constraint(validatedBy = EmailDomainValidator.class)
@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidEmailDomain {

    String message() default "Email must end with valid domain name (e.g., gmail.com, yahoo.com, outlook.com)";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
