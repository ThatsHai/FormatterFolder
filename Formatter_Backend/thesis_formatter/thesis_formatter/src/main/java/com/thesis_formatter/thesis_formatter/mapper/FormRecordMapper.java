package com.thesis_formatter.thesis_formatter.mapper;

import com.thesis_formatter.thesis_formatter.dto.response.FormRecordResponse;
import com.thesis_formatter.thesis_formatter.entity.FormRecord;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = {StudentMapper.class, TopicMapper.class})
public interface FormRecordMapper {
    FormRecordResponse toResponse(FormRecord formRecord);
    List<FormRecordResponse> toResponses(List<FormRecord> formRecords);
}