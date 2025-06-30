package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.dto.response.PaginationResponse;
import com.thesis_formatter.thesis_formatter.entity.Cell;
import com.thesis_formatter.thesis_formatter.entity.Design;
import com.thesis_formatter.thesis_formatter.entity.Form;
import com.thesis_formatter.thesis_formatter.enums.ErrorCode;
import com.thesis_formatter.thesis_formatter.exception.AppException;
import com.thesis_formatter.thesis_formatter.repo.DesignRepo;
import com.thesis_formatter.thesis_formatter.repo.FormRepo;
import com.thesis_formatter.thesis_formatter.utils.PDFDesignUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DesignService {
    DesignRepo designRepo;
    FormRepo formRepo;

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


    public ResponseEntity<Resource> downloadDesign(String designId) throws IOException {
        Design design = designRepo.findById(designId).orElseThrow(() -> new RuntimeException("Design not found"));
        generateDesignPdf(designId);

        Path filePath = Paths.get("user_resource/pdf_design/design-" + designId + ".pdf");

        if (!Files.exists(filePath)) {
            throw new RuntimeException("PDF design not found");
        }

        Resource resource = new UrlResource(filePath.toUri());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    public APIResponse<PaginationResponse<Design>> getDesignsByFormId(String formId, String page, String numberOfRecords) {
        Form form = formRepo.findById(formId).orElseThrow(() -> new AppException(ErrorCode.FORM_NOT_FOUND));
        Pageable pageable = PageRequest.of(Integer.parseInt(page), Integer.parseInt((numberOfRecords)));
        Page<Design> designsList = designRepo.findAllByForm_FormId(formId, pageable);

        PaginationResponse<Design> pageResponse = new PaginationResponse<>();
        pageResponse.setCurrentPage(designsList.getNumber());
        pageResponse.setContent(designsList.getContent());
        pageResponse.setTotalPages(designsList.getTotalPages());
        pageResponse.setTotalElements(designsList.getTotalElements());
        return APIResponse.<PaginationResponse<Design>>builder()
                .result(pageResponse)
                .code("200")
                .build();
    }
}
