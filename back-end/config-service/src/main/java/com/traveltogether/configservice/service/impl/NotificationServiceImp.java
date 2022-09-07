package com.traveltogether.configservice.service.impl;

import com.traveltogether.configservice.document.Notification;
import com.traveltogether.configservice.document.User;
import com.traveltogether.configservice.dto.ListNotificationEvent;
import com.traveltogether.configservice.service.INotificationService;
import com.traveltogether.configservice.service.IUserService;
import com.traveltogether.configservice.synchronize.CustomEventPublisher;
import com.traveltogether.configservice.synchronize.PushNotificationToSocket;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@Service
public class NotificationServiceImp implements INotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationServiceImp.class);

    @Autowired
    private MongoOperations mongoOperations;

    @Autowired
    private IUserService iUserService;

    @Autowired
    private CustomEventPublisher customEventPublisher;

    @Override
    public User getAll() {
        Notification notification = new Notification();
        notification.setPermalink("permaLink2222");
        notification.setContent("content122");
        notification.setThumbnail("thumbnail1222");
        notification.setRead(false);
        mongoOperations.insert(notification);
        User user = mongoOperations.findById("62cfdebdfc35a90ea7774ca0", User.class);
//         List<Notification> list = mongoOperations.findAll(Notification.class);
//         user.setNotifications(list);
        if (user.getNotifications() != null) {
            user.getNotifications().add(notification);
        } else if (user.getNotifications() == null) {
            List<Notification> notificationList = new ArrayList<>();
            notificationList.add(notification);
            user.setNotifications((notificationList));
        }

        mongoOperations.save(user);
        ListNotificationEvent listNotificationEvent = new ListNotificationEvent(this, user.getId(), notification);
        log.info("save successfully!");
        customEventPublisher.publishCustomEvent(listNotificationEvent);
        return user;
    }

    @Override
    public List<Notification> getAllNotificationByUserId(String userId) throws Exception {
        // TODO Auto-generated method stub
        User user = iUserService.getUserById(userId);
        // Notification notification = new Notification();
        // notification.setPermalink("permaLink");
        // notification.setContent("content1");
        // notification.setThumbnail("thumbnail1");
        // notification.setRead(false);
        // mongoOperations.insert(notification);
        // List<Notification> listadd = new ArrayList<>();
        // listadd.add(notification);
        // user.setNotifications(listadd);
        // mongoOperations.save(user);
        List<Notification> list = new ArrayList<>();
        if (user.getNotifications() != null &&
                user.getNotifications().size() > 0) {
            return user.getNotifications();
        }
        return list;
    }

    @Override
    public List<Notification> getAllNotificationAdmin(Principal principal) throws Exception {
        // TODO Auto-generated method stub
        User user = iUserService.checkUserLogging(principal);
        List<Notification> list = new ArrayList<>();
        if (user.getNotifications() != null &&
                user.getNotifications().size() > 0) {
            return user.getNotifications();
        }
        return list;

    }
}