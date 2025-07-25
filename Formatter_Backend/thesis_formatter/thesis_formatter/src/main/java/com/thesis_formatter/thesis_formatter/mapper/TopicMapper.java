package com.thesis_formatter.thesis_formatter.mapper;

import com.thesis_formatter.thesis_formatter.dto.request.TopicRequest;
import com.thesis_formatter.thesis_formatter.dto.response.TopicResponse;
import com.thesis_formatter.thesis_formatter.entity.Topic;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {TeacherMapper.class,StudentMapper.class})
public interface TopicMapper {
    @Mapping(target = "status", source = "status")
    TopicResponse toTopicResponse(Topic topic);
    Topic toTopic(TopicRequest topicRequest);
    List<TopicResponse> toTopicResponses(List<Topic> topics);
}
