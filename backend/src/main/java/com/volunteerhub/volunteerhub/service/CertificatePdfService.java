package com.volunteerhub.volunteerhub.service;

import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.*;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.properties.TextAlignment;

import com.volunteerhub.volunteerhub.model.Certificate;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class CertificatePdfService {

    public byte[] generatePdf(Certificate cert) {

        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();

            PdfWriter writer = new PdfWriter(out);
            PdfDocument pdf = new PdfDocument(writer);

            // ✅ Single Page Landscape
            PageSize size = PageSize.A4.rotate();
            Document document = new Document(pdf, size);

            float width = size.getWidth();
            float height = size.getHeight();

            // ==================================================
            // ✅ BACKGROUND TEMPLATE IMAGE
            // ==================================================
            String templatePath =
                    "src/main/resources/static/certificate_template.png";

            ImageData bgData = ImageDataFactory.create(templatePath);

            PdfPage page = pdf.addNewPage();
            PdfCanvas canvas = new PdfCanvas(page);

            // ✅ Draw background full page
            canvas.addImageFittedIntoRectangle(
                    bgData,
                    new com.itextpdf.kernel.geom.Rectangle(0, 0, width, height),
                    false
            );

            // ==================================================
            // ✅ ADD MISSING GOLD LINES (TOP + NAME)
            // ==================================================

            // Line under CERTIFICATE OF PARTICIPATION
            canvas.moveTo(250, 470);
            canvas.lineTo(590, 470);
            canvas.stroke();

            // Line under Volunteer Name
            canvas.moveTo(250, 300);
            canvas.lineTo(590, 300);
            canvas.stroke();

            // ==================================================
            // ✅ TEXT POSITIONS EXACTLY LIKE IMAGE-3
            // ==================================================

            // Presented Line
            document.add(
                    new Paragraph("This Certificate is Proudly Presented To")
                            .setFontSize(14)
                            .setFixedPosition(0, 350, width)
                            .setTextAlignment(TextAlignment.CENTER)
            );

            // Volunteer Name
            document.add(
                    new Paragraph(cert.getVolunteerName())
                            .setFontSize(30)
                            .setBold()
                            .setFixedPosition(0, 310, width)
                            .setTextAlignment(TextAlignment.CENTER)
            );

            // Successfully Completing Line
            document.add(
                    new Paragraph("For Successfully Completing Volunteering Service In")
                            .setFontSize(14)
                            .setFixedPosition(0, 270, width)
                            .setTextAlignment(TextAlignment.CENTER)
            );

            // Event Title
            document.add(
                    new Paragraph("“ " + cert.getEventTitle() + " ”")
                            .setFontSize(20)
                            .setBold()
                            .setFixedPosition(0, 235, width)
                            .setTextAlignment(TextAlignment.CENTER)
            );

            // Organizer
            document.add(
                    new Paragraph("Organized By : " + cert.getOrganizerName())
                            .setFontSize(13)
                            .setFixedPosition(0, 200, width)
                            .setTextAlignment(TextAlignment.CENTER)
            );

            // Issued Date
            document.add(
                    new Paragraph("Issued On : " + cert.getIssueDate())
                            .setFontSize(13)
                            .setFixedPosition(0, 175, width)
                            .setTextAlignment(TextAlignment.CENTER)
            );

            // Reference Number
            document.add(
                    new Paragraph("Certificate Reference No : " + cert.getReferenceNumber())
                            .setFontSize(11)
                            .setFixedPosition(0, 140, width)
                            .setTextAlignment(TextAlignment.CENTER)
            );

            // ==================================================
            // ✅ SIGNATURE LINES (Already Correct)
            // ==================================================

            // Left Signature Line
            canvas.moveTo(110, 90);
            canvas.lineTo(310, 90);
            canvas.stroke();

            // Right Signature Line
            canvas.moveTo(500, 90);
            canvas.lineTo(700, 90);
            canvas.stroke();

            // Bottom Left Signature Text
            document.add(
                    new Paragraph("Organizer Signature")
                            .setFontSize(11)
                            .setFixedPosition(140, 55, 200)
                            .setTextAlignment(TextAlignment.CENTER)
            );

            // Bottom Right Label
            document.add(
                    new Paragraph("VolunteerHub Platform\nOfficial Certificate")
                            .setFontSize(11)
                            .setFixedPosition(520, 45, 250)
                            .setTextAlignment(TextAlignment.CENTER)
            );

            document.close();
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("❌ PDF Generation Failed: " + e.getMessage());
        }
    }
}
