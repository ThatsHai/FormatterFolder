package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.dto.request.AddFormRecordRequest;
import com.thesis_formatter.thesis_formatter.dto.request.AddFormRecordFieldRequest;
import com.thesis_formatter.thesis_formatter.dto.request.UpdateFormRecordFieldRequest;
import com.thesis_formatter.thesis_formatter.dto.request.UpdateFormRecordRequest;
import com.thesis_formatter.thesis_formatter.dto.response.*;
import com.thesis_formatter.thesis_formatter.entity.*;
import com.thesis_formatter.thesis_formatter.enums.ErrorCode;
import com.thesis_formatter.thesis_formatter.enums.FormStatus;
import com.thesis_formatter.thesis_formatter.exception.AppException;
import com.thesis_formatter.thesis_formatter.mapper.FormRecordMapper;
import com.thesis_formatter.thesis_formatter.repo.*;
import com.thesis_formatter.thesis_formatter.utils.HtmlToStyledTextParser;
import com.thesis_formatter.thesis_formatter.utils.PDFDesignUtils;
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
import org.springframework.transaction.annotation.Transactional;

import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
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
    private final FormRecordMapper formRecordMapper;
    private final FormRecordFieldRepo formRecordFieldRepo;
    private final TeacherRepo teacherRepo;

    public APIResponse<FormRecordResponse> createFormRecord(AddFormRecordRequest request) {
        Student student = studentRepo.findByUserId(request.getStudentId());
        Topic topic = topicRepo.findById(request.getTopicId())
                .orElseThrow(() -> new RuntimeException("ko co topic trong formrecord"));
        Form form = topic.getForm();
        FormRecord formRecord = new FormRecord();

        formRecord.setStudent(student);
        formRecord.setTopic(topic);
        if (request.getFormRecordFields() != null) {
            List<FormRecordField> recordFields = new ArrayList<>();

            for (AddFormRecordFieldRequest fieldRequest : request.getFormRecordFields()) {
                FormField formField = formFieldRepo.findById(fieldRequest.getFormFieldId())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy formField"));

                FormRecordField recordField = FormRecordField.builder()
                        .value(fieldRequest.getValue())
                        .formField(formField)
                        .formRecord(formRecord)
                        .createdAt(LocalDateTime.now())
                        .build();

                recordFields.add(recordField);
            }

            formRecord.setFormRecordFields(recordFields);
        }
        formRecord.setCreatedAt(LocalDateTime.now());
        FormRecord savedFormRecord = formRecordRepo.save(formRecord);
        FormRecordResponse formRecordResponse = formRecordMapper.toResponse(savedFormRecord);
        return APIResponse.<FormRecordResponse>builder()
                .code("200")
                .result(formRecordResponse)
                .build();
    }

    @Transactional
    public APIResponse<FormRecordResponse> updateFormRecord(UpdateFormRecordRequest request) {
        FormRecord formRecord = formRecordRepo.findById(request.getFormRecordId()).orElseThrow(
                () -> new AppException(ErrorCode.FormRecord_NOT_FOUND));

        int currentVersion = formRecord.getVersion() + 1;

        Set<String> updatedFieldIds = request.getFormRecordFields().stream()
                .map(UpdateFormRecordFieldRequest::getFormRecordFieldId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());


        List<FormRecordField> currentFields = formRecord.getFormRecordFields();
        List<FormRecordField> allFields = new ArrayList<>();

        for (FormRecordField existingField : currentFields) {
            if (!updatedFieldIds.contains(existingField.getFormRecordFieldId()) && !existingField.isChanged()) {
                existingField.setVersion(currentVersion);
            } else existingField.setChanged(true);
            allFields.add(existingField);
        }

        List<FormRecordField> changedFields = request.getFormRecordFields().stream()
                .map(req -> {
                    FormField formField = formFieldRepo.findById(req.getFormFieldId()).orElseThrow(() -> new RuntimeException("ko co formField"));
                    return FormRecordField.builder()
                            .formRecord(formRecord)
                            .formField(formField)
                            .value(req.getValue())
                            .version(currentVersion)
                            .createdAt(LocalDateTime.now())
                            .build();
                }).collect(Collectors.toList());
        allFields.addAll(changedFields);
        formRecord.setFormRecordFields(allFields);
        formRecord.setLastModifiedAt(LocalDateTime.now());
        formRecord.setVersion(currentVersion);
        FormRecord savedRecord = formRecordRepo.save(formRecord);

        FormRecordResponse formRecordResponse = formRecordMapper.toResponse(savedRecord);
        return APIResponse.<FormRecordResponse>builder()
                .code("200")
                .result(formRecordResponse)
                .build();
    }

//    public APIResponse<void> deleteFormRecord(String formRecordId) {
//        FormRecord formRecord = formRecordRepo.findById(formRecordId).orElseThrow(() -> new AppException(ErrorCode.FormRecord_NOT_FOUND);
//
//        return APIResponse.<void>builder()
//                .code("200")
//                .build();
//    }

    public APIResponse<FormRecordResponse> updateStatus(String formRecordId, String status) {

        FormRecord formRecord = formRecordRepo.findById(formRecordId).orElseThrow(() -> new AppException(ErrorCode.FormRecord_NOT_FOUND));

        try {
            FormStatus newStatus = FormStatus.valueOf(status.toUpperCase()); // String to Enum
            formRecord.setStatus(newStatus);
        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.INVALID_FORM_STATUS); // bạn nên thêm enum này trong ErrorCode
        }

        formRecordRepo.save(formRecord);
        FormRecordResponse formRecordResponse = formRecordMapper.toResponse(formRecord);
        return APIResponse.<FormRecordResponse>builder()
                .code("200")
                .result(formRecordResponse)
                .build();
    }

    public APIResponse<PaginationResponse<FormRecordResponse>> searchByStudentId(String studentId, String page, String numberOfRecords) {
        Student student = studentRepo.findByUserId(studentId);
        if (student == null) {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }
        Pageable pageable = PageRequest.of(Integer.parseInt(page), Integer.parseInt((numberOfRecords)));
        Page<FormRecord> formRecords = formRecordRepo.findAllByStudent_UserId(studentId, pageable);

        List<FormRecordResponse> dtoList = formRecordMapper.toResponses(formRecords.getContent());

        PaginationResponse<FormRecordResponse> paginationResponse = new PaginationResponse<>();
        paginationResponse.setContent(dtoList);
        paginationResponse.setTotalElements(formRecords.getTotalElements());
        paginationResponse.setTotalPages(formRecords.getTotalPages());
        paginationResponse.setCurrentPage(formRecords.getNumber());
        return APIResponse.<PaginationResponse<FormRecordResponse>>builder()
                .code("200")
                .result(paginationResponse)
                .build();
    }

    public APIResponse<PaginationResponse<FormRecordResponse>> searchByTeacherId(String teacherId, String status, String page, String numberOfRecords) {
        Teacher teacher = teacherRepo.findByAcId(teacherId);
        if (teacher == null) {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }
        Pageable pageable = PageRequest.of(Integer.parseInt(page), Integer.parseInt((numberOfRecords)));

        FormStatus formStatus;
        try {
            formStatus = FormStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            System.out.println("Trạng thái không hợp lệ: " + status);
            throw new AppException(ErrorCode.INVALID_ARGUMENT);

        }

        Page<FormRecord> formRecords = formRecordRepo.findByTeacherAndStatus(teacherId, formStatus, pageable);


        List<FormRecordResponse> dtoList = formRecordMapper.toResponses(formRecords.getContent());

        PaginationResponse<FormRecordResponse> paginationResponse = new PaginationResponse<>();
        paginationResponse.setContent(dtoList);
        paginationResponse.setTotalElements(formRecords.getTotalElements());
        paginationResponse.setTotalPages(formRecords.getTotalPages());
        paginationResponse.setCurrentPage(formRecords.getNumber());
        return APIResponse.<PaginationResponse<FormRecordResponse>>builder()
                .code("200")
                .result(paginationResponse)
                .build();
    }


    public APIResponse<List<FormRecordResponse>> getAll() {
        List<FormRecord> formRecords = formRecordRepo.findAll();
        List<FormRecordResponse> formRecordResponses = formRecordMapper.toResponses(formRecords);
        return APIResponse.<List<FormRecordResponse>>builder()
                .code("200")
                .result(formRecordResponses)
                .build();
    }

    public APIResponse<List<FormRecordVersionInfo>> getAllVersions(String formRecordId) {
        FormRecord formRecord = formRecordRepo.findById(formRecordId).orElseThrow(() -> new AppException(ErrorCode.FormRecord_NOT_FOUND));
        List<FormRecordField> allFields = formRecord.getFormRecordFields();

        //get unique versions
        Set<Integer> versions = allFields.stream()
                .map(formRecordField -> formRecordField.getVersion())
                .collect(Collectors.toCollection(TreeSet::new)); //increasing versions list

        List<FormRecordVersionInfo> formRecordVersionInfos = versions.stream()
                .map(ver -> {
                    Optional<LocalDateTime> lastestModifiedAt = allFields.stream()
                            .filter(f -> f.getVersion() == ver)
                            .map(FormRecordField::getCreatedAt)
                            .filter(Objects::nonNull)
                            .max(LocalDateTime::compareTo);
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss dd-MM-yyyy ");
                    String time = lastestModifiedAt.map(t -> t.format(formatter)).orElse("Unknown");
                    return FormRecordVersionInfo.builder()
                            .version(ver)
                            .modifiedAt(time)
                            .build();
                })
                .sorted(Comparator.comparing(FormRecordVersionInfo::getVersion).reversed()) //decreasing by version
                .collect(Collectors.toList());
        return APIResponse.<List<FormRecordVersionInfo>>builder()
                .code("200")
                .result(formRecordVersionInfos)
                .build();
    }


    private FormRecord getFormRecordByIdAndVersion(String formRecordId, String version) {
        FormRecord formRecord = formRecordRepo.findById(formRecordId).orElseThrow(() -> new RuntimeException("không tìm thấy record"));
        System.out.println("version đang tìm: " + version);
        int currentVersion = formRecord.getVersion();
        List<FormRecordField> allFields = formRecord.getFormRecordFields();
        System.out.println("=== All Fields ===");
        allFields.forEach(f -> System.out.println(f.getFormField().getFormFieldId() + " ::: " + f.getVersion() + " ::: " + f.getValue()));

        //current version
        if (version == null || Integer.parseInt(version) == formRecord.getVersion()) {
            List<FormRecordField> currentFields = allFields.stream()
                    .filter(f -> f.getVersion() == currentVersion)
                    .collect(Collectors.toList());
            FormRecord copied = FormRecord.builder()
                    .formRecordId(formRecordId)
                    .formRecordFields(currentFields)
                    .topic(formRecord.getTopic())
                    .student(formRecord.getStudent())
                    .status(formRecord.getStatus())
                    .version(formRecord.getVersion())
                    .createdAt(formRecord.getCreatedAt())
                    .lastModifiedAt(formRecord.getLastModifiedAt())
                    .build();
            System.out.println("=== Có version ===");
            copied.getFormRecordFields().forEach(f -> System.out.println(f.getFormField().getFormFieldId() + " ::: " + f.getVersion() + " ::: " + f.getValue()));
            return copied;
        }
        //old version
        //group record field by formfiledId
        Map<String, List<FormRecordField>> fieldsByFormFieldId = allFields.stream()
                .collect(Collectors.groupingBy(field -> field.getFormField().getFormFieldId()));

        List<FormRecordField> selectedFields = new ArrayList<>();
        for (Map.Entry<String, List<FormRecordField>> entry : fieldsByFormFieldId.entrySet()) {
            String formFieldId = entry.getKey();
            List<FormRecordField> formRecordFields = entry.getValue();


            Optional<FormRecordField> exactDataField = formRecordFields.stream()
                    .filter(f -> f.getVersion() == Integer.parseInt(version.trim()))
                    .findFirst();
            if (exactDataField.isPresent()) {
                selectedFields.add(exactDataField.get());
            } else {
                //Find the nearest version greater than the requested version where isChanged equals true.

                Optional<FormRecordField> closestChangedField = formRecordFields.stream()
                        .filter(f -> f.getVersion() > Integer.parseInt(version.trim()) && f.isChanged())
                        .min(Comparator.comparing(FormRecordField::getVersion));
                if (closestChangedField.isPresent()) {
                    selectedFields.add(closestChangedField.get());
                } else {
                    Optional<FormRecordField> latestField = formRecordFields.stream()
                            .max(Comparator.comparing(FormRecordField::getVersion)); //get lastest version
                    latestField.ifPresent(selectedFields::add);
                }
            }
        }

        LocalDateTime versionModifiedAt = selectedFields.stream()
                .map(FormRecordField::getCreatedAt)
                .filter(Objects::nonNull)
                .max(LocalDateTime::compareTo)
                .orElse(formRecord.getLastModifiedAt());
        System.out.println("=== Select Fields ===");
        selectedFields.forEach(f -> System.out.println(f.getFormField().getFormFieldId() + " ::: " + f.getVersion() + " ::: " + f.getValue()));
        FormRecord copied = FormRecord.builder()
                .formRecordId(formRecordId)
                .formRecordFields(selectedFields)
                .topic(formRecord.getTopic())
                .student(formRecord.getStudent())
                .status(formRecord.getStatus())
                .version(formRecord.getVersion())
                .createdAt(formRecord.getCreatedAt())
                .lastModifiedAt(versionModifiedAt)
                .build();
        return copied;
    }

    public APIResponse<List<FormRecordFieldDiff>> getChangedFieldsFromVersion(String formRecordId, String version) {

        int currentVersion = Integer.parseInt(version.trim());

        FormRecord current = getFormRecordByIdAndVersion(formRecordId, version);
        if (currentVersion == 0) {
            List<FormRecordField> currentFields = current.getFormRecordFields();
            List<FormRecordFieldDiff> changedFields = new ArrayList<>();
            for (FormRecordField curentField : current.getFormRecordFields()) {

                changedFields.add(
                        FormRecordFieldDiff.builder()
                                .formFieldId(curentField.getFormField().getFormFieldId())
                                .fieldName(curentField.getFormField().getFieldName())
                                .oldValue(null)
                                .newValue(curentField.getValue())
                                .modifiedAt(curentField.getCreatedAt())
                                .build()
                );
            }
            return APIResponse.<List<FormRecordFieldDiff>>builder()
                    .code("200")
                    .result(changedFields)
                    .build();
        }
        String prevVersion = String.valueOf(currentVersion - 1);
        FormRecord previous = getFormRecordByIdAndVersion(formRecordId, prevVersion);

        Map<String, FormRecordField> prevFieldMap = previous.getFormRecordFields().stream()
                .collect(Collectors.toMap(f -> f.getFormField().getFormFieldId(), f -> f));

        List<FormRecordFieldDiff> changedFields = new ArrayList<>();

        for (FormRecordField curentField : current.getFormRecordFields()) {
            String fieldId = curentField.getFormField().getFormFieldId();

            FormRecordField prevField = prevFieldMap.get(fieldId);
            String oldValue = prevField != null ? prevField.getValue() : null;
            String newValue = curentField.getValue();

            if (!Objects.equals(oldValue, newValue)) {
                changedFields.add(
                        FormRecordFieldDiff.builder()
                                .formFieldId(fieldId)
                                .fieldName(curentField.getFormField().getFieldName())
                                .oldValue(oldValue)
                                .newValue(newValue)
                                .modifiedAt(curentField.getCreatedAt())
                                .build()
                );
            }
        }
        return APIResponse.<List<FormRecordFieldDiff>>builder()
                .code("200")
                .result(changedFields)
                .build();
    }

    public APIResponse<FormRecordResponse> getFormRecordById(String formRecordId, String version) {

        FormRecord copied = getFormRecordByIdAndVersion(formRecordId, version);

        FormRecordResponse formRecordResponse = formRecordMapper.toResponse(copied);
        return APIResponse.<FormRecordResponse>builder()
                .result(formRecordResponse)
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


    public ResponseEntity<Resource> downloadFormRecordPdf(String formRecordId, String designId, String version) throws MalformedURLException {
        FormRecord formRecord = getFormRecordByIdAndVersion(formRecordId, version);
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
