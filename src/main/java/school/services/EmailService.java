package school.services;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
	
	 private final JavaMailSender mailSender;

	    public EmailService(JavaMailSender mailSender) {
	        this.mailSender = mailSender;
	    }

	    // SIMPLE TEXT MAIL
	    public void sendSimpleMail(String to, String subject, String body) {

	        SimpleMailMessage message = new SimpleMailMessage();
	        message.setTo(to);
	        message.setSubject(subject);
	        message.setText(body);

	        mailSender.send(message);
	    }

	    // HTML MAIL (used for OTP / reset link)
	    public void sendHtmlMail(String to, String subject, String otp) {

	        try {
	            MimeMessage message = mailSender.createMimeMessage();
	            MimeMessageHelper helper =
	                    new MimeMessageHelper(message, true, "UTF-8");

	            helper.setTo(to);
	            helper.setSubject(subject);

	            String html = """
	                <div style="font-family:Arial">
	                    <h2>Password Reset Request</h2>
	                    <p>Your OTP is:</p>
	                    <h1 style="color:blue">%s</h1>
	                    <p>This OTP is valid for 5 minutes.</p>
	                    <p>If you did not request this, please ignore.</p>
	                </div>
	                """.formatted(otp);

	            helper.setText(html, true);
	            mailSender.send(message);

	        } catch (Exception e) {
	            throw new RuntimeException("Failed to send email");
	        }
	    }

}
