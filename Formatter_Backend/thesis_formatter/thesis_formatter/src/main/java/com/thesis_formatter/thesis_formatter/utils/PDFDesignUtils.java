package com.thesis_formatter.thesis_formatter.utils;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;

import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URL;
import java.util.List;

public class PDFDesignUtils {

    public static class CellData {
        public List<HtmlToStyledTextParser.StyledText> styledTexts;
        public String rawText;
        public int colSpan;
        public int rowSpan;
        public int topPos;
        public int leftPos;
        public boolean fromDataSource;
        public boolean fromDrag;
        public String fieldType;
    }

    public static class DesignData {
        public String title;
        public String description;
        public List<CellData> cells;
    }

    public static void generatePdfFromDesign(DesignData design, String fileName, String outputPath) throws IOException, DocumentException {
        Document document = new Document();
        PdfWriter.getInstance(document, new FileOutputStream(outputPath + fileName));
        document.open();

        ClassLoader classLoader = PDFDesignUtils.class.getClassLoader();
        URL fontUrl = classLoader.getResource("static/font-times-new-roman/times-new-roman-14.ttf");
        if (fontUrl == null) throw new RuntimeException("Font not found.");

        BaseFont unicodeBaseFont = BaseFont.createFont(fontUrl.getPath(), BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
        Font unicodeFont = new Font(unicodeBaseFont, 13, Font.NORMAL, BaseColor.BLACK);
        Font unicodeFontBold = new Font(unicodeBaseFont, 13, Font.BOLD, BaseColor.BLACK);
        Font unicodeFontItalic = new Font(unicodeBaseFont, 13, Font.ITALIC, BaseColor.BLACK);

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
        int maxRow = 0;
        for (CellData c : design.cells) {
            maxRow = Math.max(maxRow, c.topPos + Math.max(1, c.rowSpan));
        }

        PdfPTable table = new PdfPTable(totalColumns);
        table.setWidthPercentage(100);

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

        for (int row = 0; row < maxRow; row++) {
            int col = 0;
            while (col < totalColumns) {
                CellData region = regionMap[row][col];
                if (region != null && region.topPos == row && region.leftPos == col) {
                    int span = 1;
                    while (col + span < totalColumns && regionMap[row][col + span] == region) span++;

//                    Phrase phrase = buildFormattedPhrase(region.styledTexts, unicodeFont, unicodeFontBold, unicodeFontItalic);

                    Phrase phrase;
                    String type = region.fieldType != null ? region.fieldType.toUpperCase() : "TEXT";

                    switch (type) {
                        case "SHORT_ANSWER":
                            phrase = new Phrase("__________________", unicodeFont);
                            break;
                        case "LONG_ANSWER":
                            phrase = new Phrase("__________________\n\n__________________", unicodeFont);
                            break;
                        case "SELECT":
                            phrase = new Phrase("☐", unicodeFont);
                            break;
                        case "DATE":
                            phrase = new Phrase("__/__/____", unicodeFont);
                            break;

                        case "BULLETS":
                            List<HtmlToStyledTextParser.StyledText> parsed = HtmlToStyledTextParser.parseHtml(region.rawText);
                            if (!parsed.isEmpty() && parsed.get(0).text != null) {
                                parsed.get(0).text = parsed.get(0).text.replaceFirst("^[\\n\\r]+", "");
                            }
                            phrase = buildFormattedPhrase(
                                    parsed,
                                    unicodeFont, unicodeFontBold, unicodeFontItalic
                            );
                            break;

                        case "TABLE":
                            HtmlToStyledTextParser.StyledTable styledTable = HtmlToStyledTextParser.parseHtmlTable(region.rawText);

                            if (styledTable != null && styledTable.rows != null && !styledTable.rows.isEmpty()) {
                                // 🔹 Outer vertical layout (title + table)
                                PdfPTable containerTable = new PdfPTable(1);
                                containerTable.setWidthPercentage(100);

                                // --- Add title if exists ---
                                if (styledTable.title != null && !styledTable.title.isEmpty()) {
                                    Phrase titlePhrase = new Phrase(styledTable.title, unicodeFontItalic);
                                    PdfPCell titleCell = new PdfPCell(titlePhrase);
                                    titleCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                                    titleCell.setBorder(Rectangle.NO_BORDER);
                                    titleCell.setPaddingBottom(5f);
                                    containerTable.addCell(titleCell);
                                }

                                // --- Build the actual inner table ---
                                int colCount = styledTable.rows.get(0).size(); // ✅ Safe now
                                PdfPTable innerTable = new PdfPTable(colCount);
                                innerTable.setWidthPercentage(100);

                                for (List<List<HtmlToStyledTextParser.StyledText>> rowCells : styledTable.rows) {
                                    for (List<HtmlToStyledTextParser.StyledText> cellTexts : rowCells) {
                                        Phrase cellPhrase = buildFormattedPhrase(cellTexts, unicodeFont, unicodeFontBold, unicodeFontItalic);
                                        PdfPCell innerCell = new PdfPCell(cellPhrase);
                                        innerCell.setPadding(5f);
                                        innerCell.setBorder(Rectangle.BOX);
                                        innerTable.addCell(innerCell);
                                    }
                                }

                                // --- Put inner table into container ---
                                PdfPCell tableCell = new PdfPCell(innerTable);
                                tableCell.setBorder(Rectangle.NO_BORDER);
                                containerTable.addCell(tableCell);

                                // --- Now wrap container into the grid cell ---
                                PdfPCell outerCell = new PdfPCell(containerTable);
                                outerCell.setColspan(span);
                                outerCell.setBorder(Rectangle.NO_BORDER);

                                int sr = region.topPos;
                                int er = sr + region.rowSpan - 1;
                                int sc = region.leftPos;
                                int ec = sc + region.colSpan - 1;

                                if (row == sr) outerCell.enableBorderSide(Rectangle.TOP);
                                if (row == er) outerCell.enableBorderSide(Rectangle.BOTTOM);
                                if (col == sc) outerCell.enableBorderSide(Rectangle.LEFT);
                                if (col + span - 1 == ec) outerCell.enableBorderSide(Rectangle.RIGHT);

                                outerCell.setPaddingBottom(0f);

                                table.addCell(outerCell);
                                col += span;
                                continue; // 🔴 Skip default phrase logic
                            } else {
                                phrase = new Phrase("Bảng trống", unicodeFontItalic); // fallback
                            }
                            break;

                        case "TEXT":
                        default:
                            phrase = buildFormattedPhrase(region.styledTexts, unicodeFont, unicodeFontBold, unicodeFontItalic);
                            break;
                    }

                    //Tuỳ chỉnh định dạng và padding cell
                    PdfPCell cell = new PdfPCell(phrase);
                    cell.setColspan(span);
                    cell.setBorder(Rectangle.NO_BORDER);

                    int sr = region.topPos;
                    int er = sr + region.rowSpan - 1;
                    int sc = region.leftPos;
                    int ec = sc + region.colSpan - 1;

                    if (row == sr) cell.enableBorderSide(Rectangle.TOP);
                    if (row == er) cell.enableBorderSide(Rectangle.BOTTOM);
                    if (col == sc) cell.enableBorderSide(Rectangle.LEFT);
                    if (col + span - 1 == ec) cell.enableBorderSide(Rectangle.RIGHT);
                    if (region.fieldType.equals("BULLETS")) {
                        cell.setPaddingLeft(15f);
                    } else {
                        cell.setPaddingLeft(5f);
                    }
                    cell.setPaddingBottom(5f);
                    table.addCell(cell);
                    col += span;
                } else if (region != null) {
                    int span = 1;
                    while (col + span < totalColumns && regionMap[row][col + span] == region) span++;

                    PdfPCell ph = new PdfPCell(new Phrase("\u00A0", unicodeFont));
                    ph.setColspan(span);
                    ph.setBorder(Rectangle.NO_BORDER);

                    int er = region.topPos + region.rowSpan - 1;
                    if (row == er) ph.enableBorderSide(Rectangle.BOTTOM);
                    if (col == region.leftPos) ph.enableBorderSide(Rectangle.LEFT);
                    if (col + span - 1 == region.leftPos + region.colSpan - 1) ph.enableBorderSide(Rectangle.RIGHT);

                    ph.setPaddingBottom(5f);
                    table.addCell(ph);
                    col += span;
                } else {
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

    //Xử lý in đậm và nghiêng
    private static Phrase buildFormattedPhrase(List<HtmlToStyledTextParser.StyledText> styledTexts,
                                               Font normalFont, Font boldFont, Font italicFont) {
        Phrase phrase = new Phrase();
        if (styledTexts == null || styledTexts.isEmpty()) {
            phrase.add(new Chunk("\u00A0", normalFont));
            return phrase;
        }

        for (HtmlToStyledTextParser.StyledText part : styledTexts) {
            Font fontToUse = normalFont;

            if (part.bold && part.italic) {
                fontToUse = new Font(normalFont.getBaseFont(), 13, Font.BOLDITALIC);
            } else if (part.bold) {
                fontToUse = boldFont;
            } else if (part.italic) {
                fontToUse = italicFont;
            }

            phrase.add(new Chunk(part.text, fontToUse));
        }

        return phrase;
    }
}
