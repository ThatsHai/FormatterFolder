package com.thesis_formatter.thesis_formatter.mapper;

import com.thesis_formatter.thesis_formatter.dto.request.NotificationRequest;
import com.thesis_formatter.thesis_formatter.dto.response.NotificationResponse;
import com.thesis_formatter.thesis_formatter.entity.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface NotificationtionMapper {
    Notification toNotification(NotificationRequest notificationRequest);

    NotificationResponse toNotificationResponse(Notification notification);

    List<NotificationResponse> toNotificationResponseList(List<Notification> notifications);
}
