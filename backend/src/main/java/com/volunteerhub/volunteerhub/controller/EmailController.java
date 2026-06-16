package com.volunteerhub.volunteerhub.controller;

import com.volunteerhub.volunteerhub.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    // ✅ Test Email API
    @GetMapping("/send")
    public String sendTestEmail() {

        emailService.sendEmail(
                "receiver@gmail.com",
                "VolunteerHub Email Test",
                "Hello! This is a test email from VolunteerHub System 🚀"
        );

        return "✅ Email Sent Successfully!";
    }
}
