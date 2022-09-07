package com.traveltogether.configservice.controller;

import com.traveltogether.configservice.document.Interest;
import com.traveltogether.configservice.document.Notification;
import com.traveltogether.configservice.document.User;
import com.traveltogether.configservice.service.INotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.traveltogether.configservice.dto.SendSMSDto;
import com.traveltogether.configservice.payload.response.BaseError;
import com.traveltogether.configservice.payload.response.BaseResponse;
import com.traveltogether.configservice.service.IUserService;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("")
public class HomeController {

    @Autowired
    private IUserService iUserService;

    @Autowired
    private INotificationService iNotificationService;
    
    @GetMapping("send-otp")
    public ResponseEntity<BaseResponse<String>> forgotPassword(@RequestParam("phone") String phone) {

        BaseResponse<String> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(this.iUserService.sendOptSms(phone));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @PostMapping("change-password")
    public ResponseEntity<BaseResponse<User>> changePassword(
            @RequestParam("userId") String userId,
            @RequestParam("newPassword") String newPassword) {

        BaseResponse<User> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(this.iUserService.changePassword(userId, newPassword));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @GetMapping("getAll")
    public ResponseEntity<BaseResponse<User>> getAll() {

        BaseResponse<User> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(iNotificationService.getAll());
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

}
