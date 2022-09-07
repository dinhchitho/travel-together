package com.traveltogether.configservice.controller;

import com.traveltogether.configservice.document.TravelRequest;
import com.traveltogether.configservice.document.User;
import com.traveltogether.configservice.payload.response.BaseError;
import com.traveltogether.configservice.payload.response.BaseResponse;
import com.traveltogether.configservice.service.ITravelRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.Principal;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/user/travel-request")
public class TravelRequestController {

    @Autowired
    private ITravelRequestService iTravelRequestService;

    @PostMapping("")
    public ResponseEntity<BaseResponse<TravelRequest>> createTravelRequest(
            @Valid @RequestBody TravelRequest travelRequest, Principal principal) {
        BaseResponse<TravelRequest> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(this.iTravelRequestService.save(travelRequest, principal));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @PostMapping("/deactive")
    public ResponseEntity<BaseResponse<Boolean>> deactive(Principal principal) {
        BaseResponse<Boolean> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(this.iTravelRequestService.deActiveTravel(principal));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    // @PutMapping("/")
    // public ResponseEntity<BaseResponse<TravelRequest>> updateTravelRequest(@Valid
    // @RequestBody TravelRequest travelRequest) {
    // BaseResponse<TravelRequest> response = new BaseResponse<>();
    // response.setSuccess(false);
    // HttpStatus status = null;
    //
    // try {
    // response.setData(this.iTravelRequestService.update(travelRequest));
    // response.setSuccess(true);
    // } catch (Exception exception) {
    // response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(),
    // exception.getMessage()));
    // status = HttpStatus.EXPECTATION_FAILED;
    // }
    //
    // return response.isSuccess() ? ResponseEntity.ok(response) :
    // ResponseEntity.status(status).body(response);
    // }

    @GetMapping("/all")
    public ResponseEntity<BaseResponse<List<User>>> getAllUserCreatedTravelRequest() {
        BaseResponse<List<User>> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(this.iTravelRequestService.getAllUserCreatedTravelRequest());
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @GetMapping(path = "/{userIdCreated}")
    public ResponseEntity<BaseResponse<TravelRequest>> getTravelRequestByUserIdCreate(
            @PathVariable String userIdCreated) {
        BaseResponse<TravelRequest> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(this.iTravelRequestService.getByUserIdCreated(userIdCreated));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

}
