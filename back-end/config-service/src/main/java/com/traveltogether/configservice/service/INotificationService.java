package com.traveltogether.configservice.service;

import com.traveltogether.configservice.document.Notification;
import com.traveltogether.configservice.document.User;

import java.security.Principal;
import java.util.List;

public interface INotificationService {

    User getAll();

    List<Notification> getAllNotificationByUserId(String userId) throws Exception;

    List<Notification> getAllNotificationAdmin(Principal principal) throws Exception;
}
