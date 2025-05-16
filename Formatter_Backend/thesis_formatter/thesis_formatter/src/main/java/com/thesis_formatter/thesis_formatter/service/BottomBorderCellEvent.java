package com.thesis_formatter.thesis_formatter.service;

import com.itextpdf.text.pdf.PdfPCellEvent;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.BaseColor;

public class BottomBorderCellEvent implements PdfPCellEvent {

    @Override
    public void cellLayout(PdfPCell cell, Rectangle position,
                           PdfContentByte[] canvases) {

        PdfContentByte canvas = canvases[PdfPTable.LINECANVAS];

        // Draw a bottom border manually
        canvas.setLineWidth(0.5f);
        canvas.moveTo(position.getLeft(), position.getBottom());
        canvas.lineTo(position.getRight(), position.getBottom());
        canvas.stroke();
    }
}
