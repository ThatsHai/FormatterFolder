package com.thesis_formatter.thesis_formatter.mapper;

import com.thesis_formatter.thesis_formatter.dto.response.FormRecordResponse;
import com.thesis_formatter.thesis_formatter.entity.FormRecord;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {StudentMapper.class, TopicMapper.class})
public interface FormRecordMapper {
    @Mapping(source = "createdAt", target = "createdAt", dateFormat = "HH:mm:ss dd-MM-yyyy")
    @Mapping(source = "lastModifiedAt", target = "lastModifiedAt", dateFormat = "HH:mm:ss dd-MM-yyyy")
    FormRecordResponse toResponse(FormRecord formRecord);

    List<FormRecordResponse> toResponses(List<FormRecord> formRecords);
}