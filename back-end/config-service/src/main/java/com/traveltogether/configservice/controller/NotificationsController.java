package com.traveltogether.configservice.controller;

import java.util.List;

import com.traveltogether.configservice.document.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import com.traveltogether.configservice.document.Notification;
import com.traveltogether.configservice.payload.response.BaseError;
import com.traveltogether.configservice.payload.response.BaseResponse;
import com.traveltogether.configservice.service.INotificationService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/notifications")
public class NotificationsController {

    @Autowired
    private INotificationService iNotificationService;


    @GetMapping()
    public ResponseEntity<BaseResponse<List<Notification>>> getAll(
            @RequestParam(value = "userId") String userId) {

        BaseResponse<List<Notification>> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(this.iNotificationService.getAllNotificationByUserId(userId));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @PostMapping()
    public ResponseEntity<BaseResponse<User>> addNotification() {

        BaseResponse<User> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;
        try {
            response.setData(this.iNotificationService.getAll());
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }
}
