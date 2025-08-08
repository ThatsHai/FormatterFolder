package com.thesis_formatter.thesis_formatter.utils;

import java.util.Arrays;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.thesis_formatter.thesis_formatter.dto.request.SchedulePDFRequest;

import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URL;
import java.util.List;

public class DefenseScheduleToPDF {
    public static void generateStudentTopicPdf(String absolutePath, List<SchedulePDFRequest> requests) throws Exception {
        Document document = new Document();
        PdfWriter.getInstance(document, new FileOutputStream(absolutePath));
        document.open();

        // Load your Times New Roman font
        URL fontUrl = PDFDesignUtils.class.getClassLoader().getResource("static/font-times-new-roman/times-new-roman-14.ttf");
        if (fontUrl == null) throw new RuntimeException("Font not found.");
        BaseFont baseFont = BaseFont.createFont(fontUrl.getPath(), BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
        Font normalFont = new Font(baseFont, 13, Font.NORMAL, BaseColor.BLACK);
        Font boldFont = new Font(baseFont, 13, Font.BOLD, BaseColor.BLACK);
        Font headerFont = new Font(baseFont, 18, Font.BOLD, BaseColor.BLACK);

        Paragraph title = new Paragraph("THÔNG TIN BẢO VỆ ĐỀ TÀI", headerFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);

        PdfPTable table = new PdfPTable(8);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10f);

// Adjusted column widths (MSSV still wide)
        table.setWidths(new float[]{2, 4, 3, 4, 4, 4, 3, 3});

        addCell(table, "STT", boldFont, Element.ALIGN_CENTER);
        addCell(table, "MSSV", boldFont, Element.ALIGN_CENTER);
        addCell(table, "Tên sinh viên", boldFont, Element.ALIGN_CENTER);
        addCell(table, "Tên đề tài", boldFont, Element.ALIGN_CENTER);
        addCell(table, "Giảng viên hướng dẫn", boldFont, Element.ALIGN_CENTER);
        addCell(table, "Giảng viên phản biện", boldFont, Element.ALIGN_CENTER);
        addCell(table, "Thời gian", boldFont, Element.ALIGN_CENTER);
        addCell(table, "Địa điểm", boldFont, Element.ALIGN_CENTER);

        for (SchedulePDFRequest request : requests) {
            String studentId = request.getStudentId();
            String studentName = request.getStudentName();
            String topicName = request.getTopicName();
            List<String> guideNames = request.getGuideNames();
            List<String> teacherNames = request.getTeacherNames();
            String startTime = request.getStartTime();
            String place = request.getPlace();

            String[] splitTime = startTime.split(" ");
            String hour = splitTime[0];
            String date = splitTime[1];
            String timeDisplay = hour + "\n" + date;

            addCell(table, studentId, normalFont, Element.ALIGN_CENTER);
            addCell(table, studentName, normalFont, Element.ALIGN_LEFT);
            addCell(table, topicName, normalFont, Element.ALIGN_LEFT);
            addCell(table, String.join("\n", guideNames), normalFont, Element.ALIGN_LEFT);
            addCell(table, String.join("\n", teacherNames), normalFont, Element.ALIGN_LEFT);
            addCell(table, timeDisplay, normalFont, Element.ALIGN_CENTER);
            addCell(table, place, normalFont, Element.ALIGN_CENTER);
        }

        document.add(table);
        document.close();
    }

    private static void addRow(PdfPTable table, String label, String value, Font labelFont, Font valueFont) {
        PdfPCell cell1 = new PdfPCell(new Phrase(label, labelFont));
        PdfPCell cell2 = new PdfPCell(new Phrase(value, valueFont));
        cell1.setBorder(Rectangle.BOX);
        cell2.setBorder(Rectangle.BOX);
        table.addCell(cell1);
        table.addCell(cell2);
    }

    private static void addCell(PdfPTable table, String text, Font font, int alignment) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setHorizontalAlignment(alignment);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setBorder(Rectangle.BOX);
        cell.setPadding(5f);
        cell.setMinimumHeight(30f); // optional: ensure enough height for list items
        table.addCell(cell);
    }

}
