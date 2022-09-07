package com.traveltogether.configservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.traveltogether.configservice.document.Ads;
import com.traveltogether.configservice.document.Comment;
import com.traveltogether.configservice.document.User;
import com.traveltogether.configservice.payload.response.BaseError;
import com.traveltogether.configservice.payload.response.BaseResponse;
import com.traveltogether.configservice.service.IAdsService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.security.Principal;
import java.util.List;

import javax.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/local-guild")
public class LocalGuildController {

    @Autowired
    private IAdsService adsService;

//    @GetMapping("/getByLocation")
//    public ResponseEntity<BaseResponse<List<User>>> getByLocation(@RequestParam("location") String location) {
//        BaseResponse<List<User>> response = new BaseResponse<>();
//        response.setSuccess(false);
//        HttpStatus status = null;
//
//        try {
//            response.setData(adsService.findByLocation(location));
//            response.setSuccess(true);
//        } catch (Exception exception) {
//            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
//            status = HttpStatus.EXPECTATION_FAILED;
//        }
//
//        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
//    }

    @GetMapping("/getById")
    public ResponseEntity<BaseResponse<Ads>> getById(@RequestParam("qaId") String qaId) {
        BaseResponse<Ads> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(adsService.findById(qaId));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @PutMapping("")
    public ResponseEntity<BaseResponse<Ads>> updateAds(@Valid @RequestBody Ads ads, Principal principal) {
        BaseResponse<Ads> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(adsService.update(ads, principal));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @PostMapping("")
    public ResponseEntity<BaseResponse<Ads>> saveAds(@Valid @RequestBody Ads ads, Principal principal) {
        BaseResponse<Ads> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(adsService.save(ads, principal));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @DeleteMapping("")
    public ResponseEntity<BaseResponse<String>> deleteById(@RequestParam("adsId") String adsId, Principal principal) {
        BaseResponse<String> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(adsService.delete(adsId, principal));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @PostMapping("/like")
    public ResponseEntity<BaseResponse<String>> likeAds(@RequestParam("adsId") String adsId,
            @RequestParam("UserIdOfAds") String UserIdOfAds, Principal principal) {
        BaseResponse<String> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(adsService.likeAds(adsId, UserIdOfAds, principal));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @PostMapping("/comment")
    public ResponseEntity<BaseResponse<Comment>> commentAds(@Valid @RequestBody Comment comment,
            @RequestParam("adsId") String adsId, @RequestParam("UserIdOfAds") String UserIdOfAds, Principal principal) {
        BaseResponse<Comment> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(adsService.commentAds(comment, adsId, UserIdOfAds, principal));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

}
