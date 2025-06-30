package com.thesis_formatter.thesis_formatter.utils;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;

import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URL;
import java.util.List;

public class PDFDesignUtils {

    public static class CellData {
        public String text;
        public int colSpan;
        public int rowSpan;
        public int topPos;
        public int leftPos;
    }

    public static class DesignData {
        public String title;
        public String description;
        public List<CellData> cells;
    }

    public static void generatePdfFromDesign(DesignData design, String fileName) throws IOException, DocumentException {
        Document document = new Document();
        PdfWriter.getInstance(document, new FileOutputStream("./user_resource/pdf_design/" + fileName));
        document.open();

        // Load font
        ClassLoader classLoader = PDFDesignUtils.class.getClassLoader();
        URL fontUrl = classLoader.getResource("static/font-times-new-roman/times-new-roman-14.ttf");
        if (fontUrl == null) throw new RuntimeException("Font not found.");

        BaseFont unicodeBaseFont = BaseFont.createFont(fontUrl.getPath(), BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
        Font unicodeFont = new Font(unicodeBaseFont, 13, Font.NORMAL, BaseColor.BLACK);
        Font unicodeFontBold = new Font(unicodeBaseFont, 13, Font.BOLD, BaseColor.BLACK);
        Font unicodeFontItalic = new Font(unicodeBaseFont, 13, Font.ITALIC, BaseColor.BLACK);

        // Title & description
        if (design.title != null) {
            Paragraph title = new Paragraph(design.title, unicodeFontBold);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(10f);
            document.add(title);
        }
        if (design.description != null) {
            Paragraph desc = new Paragraph(design.description, unicodeFont);
            desc.setSpacingAfter(10f);
            document.add(desc);
        }

        final int totalColumns = 12;
        // calculate rows
        int maxRow = 0;
        for (CellData c : design.cells) {
            maxRow = Math.max(maxRow, c.topPos + Math.max(1, c.rowSpan));
        }

        PdfPTable table = new PdfPTable(totalColumns);
        table.setWidthPercentage(100);

        // build region map
        CellData[][] regionMap = new CellData[maxRow][totalColumns];
        for (CellData c : design.cells) {
            for (int r = 0; r < c.rowSpan; r++) {
                for (int co = 0; co < c.colSpan; co++) {
                    int rr = c.topPos + r;
                    int cc = c.leftPos + co;
                    if (rr < maxRow && cc < totalColumns) regionMap[rr][cc] = c;
                }
            }
        }

        // render row by row
        for (int row = 0; row < maxRow; row++) {
            int col = 0;
            while (col < totalColumns) {
                CellData region = regionMap[row][col];
                if (region != null && region.topPos == row && region.leftPos == col) {
                    // top-left cell -> actual content
                    // determine horizontal span in this row
                    int span = 1;
                    while (col + span < totalColumns && regionMap[row][col + span] == region) span++;
                    PdfPCell cell = new PdfPCell(new Phrase(
                            (region.text == null || region.text.isEmpty()) ? "\u00A0" : region.text,
                            unicodeFont));
                    cell.setColspan(span);
                    // remove rowspan: rely on placeholder rows instead
                    //cell.setRowspan(region.rowSpan);
                    cell.setBorder(Rectangle.NO_BORDER);
                    // borders on edges of region
                    int sr = region.topPos;
                    int er = sr + region.rowSpan - 1;
                    int sc = region.leftPos;
                    int ec = sc + region.colSpan - 1;
                    if (row == sr) cell.enableBorderSide(Rectangle.TOP);
                    if (row == er) cell.enableBorderSide(Rectangle.BOTTOM);
                    if (col == sc) cell.enableBorderSide(Rectangle.LEFT);
                    if (col + span - 1 == ec) cell.enableBorderSide(Rectangle.RIGHT);
                    cell.setPaddingBottom(5f);
                    table.addCell(cell);
                    col += span;
                } else if (region != null) {
                    // inside region but not top-left: placeholder to maintain row height
                    int span = 1;
                    while (col + span < totalColumns && regionMap[row][col + span] == region) span++;
                    PdfPCell ph = new PdfPCell(new Phrase("\u00A0", unicodeFont));
                    ph.setColspan(span);
                    ph.setBorder(Rectangle.NO_BORDER);
                    // bottom border if last row
                    int er = region.topPos + region.rowSpan - 1;
                    if (row == er) ph.enableBorderSide(Rectangle.BOTTOM);
                    // left border if first col
                    if (col == region.leftPos) ph.enableBorderSide(Rectangle.LEFT);
                    // right border if last col in span
                    if (col + span - 1 == region.leftPos + region.colSpan - 1) ph.enableBorderSide(Rectangle.RIGHT);
                    ph.setPaddingBottom(5f);
                    table.addCell(ph);
                    col += span;
                } else {
                    // empty cell
                    PdfPCell empty = new PdfPCell(new Phrase("\u00A0", unicodeFont));
                    empty.setBorder(Rectangle.BOX);
                    empty.setPaddingBottom(5f);
                    table.addCell(empty);
                    col++;
                }
            }
        }

        document.add(table);
        document.close();
    }
}
