package com.volunteerhub.volunteerhub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // ======================================================
    // ✅ COMMON EMAIL SENDER METHOD
    // ======================================================
    public void sendMail(String toEmail, String subject, String body) {

        try {
            SimpleMailMessage message = new SimpleMailMessage();

            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(body);

            mailSender.send(message);

            System.out.println("✅ Email Sent Successfully To: " + toEmail);

        } catch (Exception e) {
            System.out.println("❌ Email Sending Failed: " + e.getMessage());
        }
    }

    // ======================================================
    // ✅ ONLY NEEDED FIX (Alias Method)
    // ======================================================
    public void sendEmail(String toEmail, String subject, String body) {
        sendMail(toEmail, subject, body);
    }

    // ======================================================
    // ✅ SEND CERTIFICATE WITH PDF ATTACHMENT
    // ======================================================
    public void sendCertificateWithAttachment(
            String toEmail,
            String subject,
            String body,
            byte[] pdfBytes,
            String fileName
    ) {

        try {
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(body);

            // ✅ Attach PDF File
            helper.addAttachment(
                    fileName,
                    new ByteArrayResource(pdfBytes)
            );

            mailSender.send(message);

            System.out.println("✅ Certificate Email Sent Successfully!");

        } catch (Exception e) {
            System.out.println("❌ Certificate Mail Failed: " + e.getMessage());
        }
    }

    // ======================================================
    // ✅ REGISTER EMAIL
    // ======================================================
    public void sendWelcomeMail(String userEmail, String userName) {

        String subject = "🎉 Welcome to VolunteerHub!";

        String body =
                "Hello " + userName + ",\n\n"
                        + "Welcome to VolunteerHub Platform!\n"
                        + "Your registration was successful.\n\n"
                        + "Now you can explore volunteering events and participate.\n\n"
                        + "Regards,\n"
                        + "VolunteerHub Team";

        sendMail(userEmail, subject, body);
    }

    // ======================================================
    // ✅ EVENT APPROVAL EMAIL
    // ======================================================
    public void sendApprovalMail(String userEmail, String eventName) {

        String subject = "✅ Event Application Approved";

        String body =
                "Congratulations!\n\n"
                        + "Your request to join the event \"" + eventName + "\" has been approved.\n\n"
                        + "Thank you for being part of VolunteerHub.\n\n"
                        + "Regards,\n"
                        + "VolunteerHub Team";

        sendMail(userEmail, subject, body);
    }

    // ======================================================
    // ✅ CERTIFICATE ISSUED EMAIL
    // ======================================================
    public void sendCertificateMail(String userEmail, String eventName) {

        String subject = "🏅 Your Certificate is Ready!";

        String body =
                "Hello Volunteer,\n\n"
                        + "Your participation certificate for the event \"" + eventName + "\" has been generated.\n\n"
                        + "You can download it from your VolunteerHub dashboard.\n\n"
                        + "Regards,\n"
                        + "VolunteerHub Team";

        sendMail(userEmail, subject, body);
    }
}
