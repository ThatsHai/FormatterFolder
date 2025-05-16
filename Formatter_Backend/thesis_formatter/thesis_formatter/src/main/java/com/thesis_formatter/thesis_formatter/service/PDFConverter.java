package com.thesis_formatter.thesis_formatter.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;

import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URL;
import java.util.Arrays;
import java.util.List;

public class PDFConverter {


    public static void printTitle(Font unicodeFont, Document document, String text) throws DocumentException {
        Paragraph titleParagraph = new Paragraph(text, unicodeFont);
        titleParagraph.setAlignment(Element.ALIGN_CENTER);
        titleParagraph.setSpacingAfter(15f);
        document.add(titleParagraph);
    }

    public static void addCellWithColSpan(
            Font font,
            PdfPTable table,
            String text,
            int colSpan,
            int totalColumns
    ) {
        addCellWithSpanAndDescription(font, table, text, colSpan, 1, totalColumns, null, null);
    }

    public static void addCellWithRowSpan(
            Font font,
            PdfPTable table,
            String text,
            int rowSpan,
            int totalColumns
    ) {
        addCellWithSpanAndDescription(font, table, text, 3, rowSpan, totalColumns, null, null);
    }

    public static void addCellWithSpanAndDescription(
            Font font,
            PdfPTable table,
            String text,
            int colSpan,
            int rowSpan,
            int totalColumns,
            String description,
            Font descriptionFont
    ) {
        Paragraph paragraph = new Paragraph();
        paragraph.add(new Phrase(text, font));
        if (description != null && descriptionFont != null) {
            paragraph.add(new Phrase(description, descriptionFont));
        }

        PdfPCell mainCell = new PdfPCell(paragraph);
        mainCell.setColspan(colSpan);
        mainCell.setRowspan(rowSpan);
        mainCell.setHorizontalAlignment(Element.ALIGN_LEFT);
        mainCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        mainCell.setBorderWidth(0.5f);
        mainCell.setPaddingBottom(2.5f);
        if (rowSpan > 1) {
            mainCell.setBorder(Rectangle.LEFT | Rectangle.RIGHT);
        }

        table.addCell(mainCell);

        // Fill the remaining columns in the current row
        if (rowSpan == 1) {
            int emptyCells = totalColumns - colSpan;
            if (emptyCells > 0) {
                PdfPCell emptyCell = new PdfPCell(new Phrase("\u00A0"));
                emptyCell.setColspan(emptyCells);
                emptyCell.setBorderWidth(0.5f);
                emptyCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                table.addCell(emptyCell);
            }
        }
        if (rowSpan > 1) {
            for (int i = 0; i < rowSpan; i++) {
                for (int j = 0; j < totalColumns; j++) {
                    PdfPCell emptyCell = new PdfPCell(new Phrase("\u00A0"));
                    emptyCell.setBorderWidth(0.5f);
                    int border = 0;
                    if (j == 0) {
                        border |= Rectangle.LEFT;
                    }
                    if (j == totalColumns - 1) {
                        border |= Rectangle.RIGHT;
                    }
                    if (i == rowSpan - 1) {
                        border |= Rectangle.BOTTOM;
                    }
                    emptyCell.setBorder(border);
                    table.addCell(emptyCell);
                }
            }

        }
    }

    public static void addLeftRowspanAndRightColspanCells(
            Font leftFont,
            Font rightFont,
            PdfPTable table,
            java.util.List<String> rightTexts,  // Each right cell goes to its own row
            int totalColumns,
            String leftText,
            String description,
            Font descriptionFont
    ) {
        if (rightTexts == null || rightTexts.isEmpty()) {
            return;
        }

        int leftColSpan = 1;
        int leftRowSpan = rightTexts.size();
        int rightColSpan = totalColumns - leftColSpan;

        // 1. Add the left cell (rowspan)
        Paragraph leftParagraph = new Paragraph();
        leftParagraph.add(new Phrase(leftText, leftFont));
        if (description != null && descriptionFont != null) {
            leftParagraph.add(new Phrase(description, descriptionFont));
        }

        PdfPCell leftCell = new PdfPCell(leftParagraph);
        leftCell.setColspan(leftColSpan);
        leftCell.setRowspan(leftRowSpan);
        leftCell.setHorizontalAlignment(Element.ALIGN_LEFT);
        leftCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        leftCell.setBorderWidth(0.5f);
        leftCell.setPaddingBottom(2.5f);
        table.addCell(leftCell);

        for (String rightText : rightTexts) {
            Paragraph rightParagraph = new Paragraph();
            rightParagraph.add(new Phrase(rightText, rightFont));
            if (description != null && descriptionFont != null) {
                rightParagraph.add(new Phrase(description, descriptionFont));
            }

            PdfPCell rightCell = new PdfPCell(rightParagraph);
            rightCell.setColspan(rightColSpan);
            rightCell.setHorizontalAlignment(Element.ALIGN_LEFT);
            rightCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            rightCell.setBorderWidth(0.5f);
            rightCell.setPaddingBottom(2.5f);
            table.addCell(rightCell);
        }
    }


    public static void main(String[] args) throws IOException, DocumentException {
        Document document = new Document();
        PdfWriter.getInstance(document, new FileOutputStream("iTextUnicodeTitle.pdf"));
        document.open();

        // Load the font from resources
        ClassLoader classLoader = PDFConverter.class.getClassLoader();
        URL fontUrl = classLoader.getResource("static/font-times-new-roman/times-new-roman-14.ttf");
        if (fontUrl == null) {
            throw new RuntimeException("Font file not found in resources.");
        }

        BaseFont unicodeBaseFont = BaseFont.createFont(
                fontUrl.getPath(),
                BaseFont.IDENTITY_H,
                BaseFont.EMBEDDED
        );

        Font unicodeFont = new Font(unicodeBaseFont, 13, Font.NORMAL, BaseColor.BLACK);
        Font unicodeFontBold = new Font(unicodeBaseFont, 13, Font.BOLD, BaseColor.BLACK);
        Font unicodeFontItalic = new Font(unicodeBaseFont, 13, Font.ITALIC, BaseColor.BLACK);

        printTitle(unicodeFontBold, document, "ĐỀ CƯƠNG LUẬN VĂN LUẬN ÁN");
        PdfPTable table = new PdfPTable(3);

        table.setWidthPercentage(100);

        addCellWithSpanAndDescription(unicodeFontBold, table, " 1. TÊN ĐỀ TÀI", 3, 1, 3, " (Không quá ... từ):", unicodeFont);
        addCellWithColSpan(unicodeFontItalic, table, " Điền tên đề tài tại đây", 3, 3);

        addCellWithColSpan(unicodeFontBold, table, " 2. NGƯỜI THỰC HIỆN", 3, 3);
        addCellWithColSpan(unicodeFont, table, " - Tên sinh viên", 1, 3);
        addCellWithColSpan(unicodeFont, table, " - Khóa (Mã số sinh viên)", 1, 3);
        addCellWithColSpan(unicodeFont, table, " - Ngành:", 1, 3);
        addCellWithColSpan(unicodeFont, table, " - Đơn vị (Khoa/Bộ môn)", 1, 3);
        addCellWithColSpan(unicodeFont, table, " - Khoa/Trường", 1, 3);
        addCellWithColSpan(unicodeFont, table, " - Năm", 1, 3);


        List<String> names = Arrays.asList("GVHD 1", "GVHD 2");
        addLeftRowspanAndRightColspanCells(unicodeFontBold, unicodeFont, table,
                Arrays.asList("1. GVHD", "2. GVHD"),
                3, " 3. CÁN BỘ HƯỚNG DẪN", null, null);

        addCellWithColSpan(unicodeFontBold, table, " 4. GIỚI THIỆU", 3, 3);
        addCellWithColSpan(unicodeFontItalic, table, " Điền hay copy dán vào đây", 3, 3);

        addCellWithColSpan(unicodeFontBold, table, " 5. MỤC TIÊU CỦA ĐỀ TÀI", 3, 3);
        addCellWithColSpan(unicodeFont, table, " 5.1 Mục tiêu tổng quát nếu có", 3, 3);
        addCellWithColSpan(unicodeFontBold, table, "\u00A0", 3, 3);
        addCellWithColSpan(unicodeFont, table, " 5.2 Mục tiêu cụ thể (liệt kê không quá 3 mục tiêu)", 3, 3);
        addCellWithRowSpan(unicodeFont, table, "\u00A0", 3, 3);

        addCellWithSpanAndDescription(unicodeFontBold, table, " 6. LƯỢC KHẢO TÀI LIỆU", 3, 1, 3, " (Không quá 5 trang)", unicodeFont);
        addCellWithRowSpan(unicodeFont, table, " \u00A0", 7, 3);

        addCellWithSpanAndDescription(unicodeFontBold, table, " 7. PHƯƠNG PHÁP NGHIÊN CỨU", 3, 1, 3, " (Không quá 5 trang)", unicodeFont);
        addCellWithRowSpan(unicodeFont, table, " \u00A0", 3, 3);

        addCellWithSpanAndDescription(unicodeFontBold, table, " 8. KẾ HOẠCH THỰC HIỆN", 3, 1, 3, " (Không quá 5 trang)", unicodeFont);
        addCellWithRowSpan(unicodeFont, table, " \u00A0", 3, 3);

        document.add(table);

        document.close();
    }
}
