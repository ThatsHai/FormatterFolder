package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.dto.request.AddFormRecordRequest;
import com.thesis_formatter.thesis_formatter.dto.request.FormRecordFieldRequest;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.dto.response.PaginationResponse;
import com.thesis_formatter.thesis_formatter.entity.*;
import com.thesis_formatter.thesis_formatter.enums.ErrorCode;
import com.thesis_formatter.thesis_formatter.exception.AppException;
import com.thesis_formatter.thesis_formatter.repo.*;
import com.thesis_formatter.thesis_formatter.utils.HtmlToStyledTextParser;
import com.thesis_formatter.thesis_formatter.utils.PDFDesignUtils;
import jakarta.persistence.criteria.From;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.SQLOutput;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FormRecordService {
    FormRecordRepo formRecordRepo;
    private final FormFieldRepo formFieldRepo;
    private final StudentRepo studentRepo;
    private final TopicRepo topicRepo;
    private final DesignRepo designRepo;

    public APIResponse<FormRecord> createFormRecord(AddFormRecordRequest request) {
        Student student = studentRepo.findByUserId(request.getStudentId());
        Topic topic = topicRepo.findById(request.getTopicId())
                .orElseThrow(() -> new RuntimeException("ko co topic trong formrecord"));
        Form form = topic.getForm();
        FormRecord formRecord = new FormRecord();

        formRecord.setStudent(student);
        formRecord.setTopic(topic);
        if (request.getFormRecordFields() != null) {
            List<FormRecordField> recordFields = new ArrayList<>();

            for (FormRecordFieldRequest fieldRequest : request.getFormRecordFields()) {
                FormField formField = formFieldRepo.findById(fieldRequest.getFormFieldId())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy formField"));

                FormRecordField recordField = FormRecordField.builder()
                        .value(fieldRequest.getValue())
                        .formField(formField)
                        .formRecord(formRecord)
                        .build();

                recordFields.add(recordField);
            }

            formRecord.setFormRecordFields(recordFields);
        }

        FormRecord savedFormRecord = formRecordRepo.save(formRecord);
        return APIResponse.<FormRecord>builder()
                .code("200")
                .result(savedFormRecord)
                .build();
    }

    public APIResponse<PaginationResponse<FormRecord>> searchByStudentId(String studentId, String page, String numberOfRecords) {
        Student student = studentRepo.findByUserId(studentId);
        if (student == null) {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }
        Pageable pageable = PageRequest.of(Integer.parseInt(page), Integer.parseInt((numberOfRecords)));
        Page<FormRecord> formRecords = formRecordRepo.findAllByStudent_UserId(studentId, pageable);
        PaginationResponse<FormRecord> paginationResponse = new PaginationResponse<>();
        paginationResponse.setContent(formRecords.getContent());
        paginationResponse.setTotalElements(formRecords.getTotalElements());
        paginationResponse.setTotalPages(formRecords.getTotalPages());
        paginationResponse.setCurrentPage(formRecords.getNumber());
        return APIResponse.<PaginationResponse<FormRecord>>builder()
                .code("200")
                .result(paginationResponse)
                .build();
    }

    public APIResponse<List<FormRecord>> getAll() {
        return APIResponse.<List<FormRecord>>builder()
                .code("200")
                .result(formRecordRepo.findAll())
                .build();
    }

    public APIResponse<FormRecord> getFormRecordById(String formRecordId) {
        FormRecord formRecord = formRecordRepo.findById(formRecordId).orElseThrow(() -> new RuntimeException("không tìm thấy record"));
        return APIResponse.<FormRecord>builder()
                .result(formRecord)
                .code("200")
                .build();
    }

    private String replacePlaceholders(String text, Map<String, String> placeholderValueMap) {
        Pattern pattern = Pattern.compile("\\$\\{\\{(.*?)}}");
        Matcher matcher = pattern.matcher(text);
        StringBuffer sb = new StringBuffer();

        while (matcher.find()) {
            String placeholder = matcher.group(1).trim();
            String replacement = placeholderValueMap.getOrDefault(placeholder, "");
            matcher.appendReplacement(sb, Matcher.quoteReplacement(replacement));
        }
        matcher.appendTail(sb);

        return sb.toString();
    }


    public void generateFormRecordPdf(FormRecord formRecord, Design design) {
        // Step 1: Build lookup map: placeholder name ➜ field value
        Map<String, String> placeholderValueMap = formRecord.getFormRecordFields().stream()
                .collect(Collectors.toMap(
                        f -> f.getFormField().getFieldName(), // placeholder key
                        f -> f.getValue()                    // value to insert
                ));

        PDFDesignUtils.DesignData data = new PDFDesignUtils.DesignData();
        data.title = design.getTitle();
        data.description = design.getDescription();

        data.cells = design.getCells().stream().map(cell -> {
            PDFDesignUtils.CellData c = new PDFDesignUtils.CellData();
            c.fromDrag = cell.isFromDrag();
            c.fromDataSource = cell.isFromDataSource();

            String finalText = "";

            if (c.fromDrag) {
                // Extract the first placeholder inside ${{ }}
                Pattern pattern = Pattern.compile("\\$\\{\\{(.*?)}}");
                Matcher matcher = pattern.matcher(cell.getText());

                if (matcher.find()) {
                    String placeholder = matcher.group(1).trim();
                    finalText = placeholderValueMap.getOrDefault(placeholder, "");
                }

                System.out.println("c text: " + cell.getText());
                System.out.println("Noi dung: " + finalText);
            } else if (c.fromDataSource) {
                // If fromDataSource: replace all placeholders with field values
                finalText = replacePlaceholders(cell.getText(), placeholderValueMap);

            } else {
                finalText = cell.getText();
            }

            c.styledTexts = HtmlToStyledTextParser.parseHtml(finalText);
            c.colSpan = cell.getColSpan();
            c.rowSpan = cell.getRowSpan();
            c.topPos = cell.getTopPos();
            c.leftPos = cell.getLeftPos();

            return c;
        }).collect(Collectors.toList());

        String fileName = "formRecord-" + formRecord.getFormRecordId() + ".pdf";

        try {
            PDFDesignUtils.generatePdfFromDesign(data, fileName, "./user_resource/pdf_formRecord/");
        } catch (Exception e) {
            throw new RuntimeException("PDF generation failed", e);
        }
    }


    public ResponseEntity<Resource> downloadFormRecordPdf(String formRecordId, String designId) throws MalformedURLException {
        FormRecord formRecord = formRecordRepo.findById(formRecordId).orElseThrow(() -> new AppException(ErrorCode.RECORD_NOT_FOUND));
        Design design = designRepo.findById(designId).orElseThrow(() -> new AppException(ErrorCode.DESIGN_NOT_FOUND));
        generateFormRecordPdf(formRecord, design);

        Path filePath = Paths.get("user_resource/pdf_formRecord/formRecord-" + formRecordId + ".pdf");
        if (!Files.exists(filePath)) {
            throw new RuntimeException("PDF file record not found");
        }
        Resource resource = new UrlResource(filePath.toUri());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
