package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.entity.Cell;
import com.thesis_formatter.thesis_formatter.entity.Design;
import com.thesis_formatter.thesis_formatter.repo.DesignRepo;
import com.thesis_formatter.thesis_formatter.utils.PDFDesignUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DesignService {
    DesignRepo designRepo;

    public APIResponse<List<Design>> getDesigns() {
        List<Design> designs = designRepo.findAll();
        return APIResponse.<List<Design>>builder()
                .result(designs)
                .code("200")
                .build();
    }

    public APIResponse<Design> addDesign(Design design) {
        if (design.getCells() != null) {
            for (Cell c : design.getCells()) {
                c.setDesign(design);
            }
        }

        Design saved = designRepo.save(design); // cascade handles empty list just fine

        return APIResponse.<Design>builder()
                .result(saved)
                .code("200")
                .build();
    }


    public void generateDesignPdf(String designId) {
        Design design = designRepo.findById(designId)
                .orElseThrow(() -> new RuntimeException("Design not found"));

        PDFDesignUtils.DesignData data = new PDFDesignUtils.DesignData();
        data.title = design.getTitle();
        data.description = design.getDescription();
        data.cells = design.getCells().stream().map(cell -> {
            PDFDesignUtils.CellData c = new PDFDesignUtils.CellData();
            c.text = cell.getText();
            c.colSpan = cell.getColSpan();
            c.rowSpan = cell.getRowSpan();
            c.topPos = cell.getTopPos();
            c.leftPos = cell.getLeftPos();
            return c;
        }).collect(Collectors.toList());

        String outputPath = "design-" + designId + ".pdf";
        try {
            PDFDesignUtils.generatePdfFromDesign(data, outputPath);
        } catch (Exception e) {
            throw new RuntimeException("PDF generation failed", e);
        }

    }


    public APIResponse<Design> downloadDesign(String designId) {
        Design design = designRepo.findById(designId).orElseThrow(() -> new RuntimeException("Design not found"));
        generateDesignPdf(designId);
        return APIResponse.<Design>builder()
                .code("200")
                .result(design)
                .build();
    }
}
