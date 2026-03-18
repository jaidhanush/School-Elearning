package school.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.List;

public class EmailDomainValidator implements ConstraintValidator<ValidEmailDomain, String> {

    private static final List<String> ALLOWED_DOMAINS =
            List.of("gmail.com", "yahoo.com", "outlook.com");

    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {

        if (email == null || !email.contains("@")) {
            return false;
        }

        String domain = email.substring(email.indexOf("@") + 1);

        return ALLOWED_DOMAINS.contains(domain);
    }
}