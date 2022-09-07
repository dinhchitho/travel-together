package com.traveltogether.configservice.synchronize;

import com.traveltogether.configservice.dto.ListNotificationEvent;
import com.traveltogether.configservice.dto.ListNotificationEventAdmin;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Component
public class CustomEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(CustomEventPublisher.class);

    @Autowired
    private ApplicationEventPublisher applicationEventPublisher;

    public void publishCustomEvent(ListNotificationEvent listNotificationEvent) {
        log.debug("push ListNotificationEvent : " + listNotificationEvent);
        applicationEventPublisher.publishEvent(listNotificationEvent);
    }

    public void publishCustomEventAdmin(ListNotificationEventAdmin listNotificationEventAdmin) {
        log.debug("push listNotificationEventAdmin : " + listNotificationEventAdmin);
        applicationEventPublisher.publishEvent(listNotificationEventAdmin);
    }

}
