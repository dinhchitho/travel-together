package com.traveltogether.configservice.synchronize;

import com.traveltogether.configservice.constanst.Constant;
import com.traveltogether.configservice.document.Notification;
import com.traveltogether.configservice.utils.RestTemplates;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationListener;

import com.traveltogether.configservice.dto.ListNotificationEvent;
import com.traveltogether.configservice.dto.ListNotificationEventAdmin;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Component
public class PushNotificationToSocketAdmin implements
        ApplicationListener<ListNotificationEventAdmin> {

    private static final Logger log = LoggerFactory.getLogger(PushNotificationToSocketAdmin.class);

    @Value("${spring.socket.url}")
    private String socketUrl;

    @Override
    public void onApplicationEvent(ListNotificationEventAdmin payload) {
        // TODO Auto-generated method stub
        try {
            NotificationDTO sync = new NotificationDTO(payload.getUserId(),
                    payload.getPayload());
            HttpServletRequest httpRequest = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes())
                    .getRequest();
            // HttpHeaders headers = new HttpHeaders();
            // headers.add(HttpHeaders.AUTHORIZATION,
            // httpRequest.getHeader(HttpHeaders.AUTHORIZATION));

            HttpEntity<NotificationDTO> request = new HttpEntity<>(sync);
            RestTemplate restTemplate = RestTemplates.getRestTemplate();
            restTemplate.exchange(socketUrl + Constant.SocketAPI.SYNC_NOTIFICATION_ADMIN,
                    HttpMethod.POST, request,
                    String.class);
            log.info("Push Notification to Socket successfully!");
        } catch (Exception e) {
            // TODO: handle exception
            log.error("Push Notification to Socket error", e);
        }
    }

    @AllArgsConstructor
    @Getter
    class NotificationDTO {
        private String userId;
        private Notification payload;
    }
}
