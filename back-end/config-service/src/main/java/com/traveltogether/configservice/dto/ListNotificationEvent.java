package com.traveltogether.configservice.dto;

import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.springframework.context.ApplicationEvent;

import com.traveltogether.configservice.document.Notification;

import lombok.Getter;

@Getter
public class ListNotificationEvent extends ApplicationEvent {

    private static final long serialVersionUID = 1210323172775384031L;
    private String userId;
    private Notification payload;

    public ListNotificationEvent(Object source, String userId, Notification payload) {
        super(source);
        //TODO Auto-generated constructor stub
        this.userId = userId;
        this.payload = payload;
    }

    @Override
    public String toString() {
        // TODO Auto-generated method stub
        return "ListNotificationEvent UserId[" + userId + "] [payload=" + payload + "]";
    }

    
}
