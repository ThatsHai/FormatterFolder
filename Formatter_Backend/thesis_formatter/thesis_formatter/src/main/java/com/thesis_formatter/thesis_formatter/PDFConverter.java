package com.thesis_formatter.thesis_formatter;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URL;

public class PDFConverter {
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

        Paragraph titleParagraph = new Paragraph("ĐỀ CƯƠNG LUẬN VĂN LUẬN ÁN", unicodeFont);

        titleParagraph.setAlignment(Element.ALIGN_CENTER);

        document.add(titleParagraph);
        document.close();
    }
}
