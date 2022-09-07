package com.traveltogether.configservice.controller;

import com.traveltogether.configservice.config.security.service.impl.UserDetailsServiceImpl;
import com.traveltogether.configservice.document.*;
import com.traveltogether.configservice.dto.ObjectIdentifyCardDTO;
import com.traveltogether.configservice.payload.response.BaseError;
import com.traveltogether.configservice.payload.response.BaseResponse;
import com.traveltogether.configservice.service.IAdsService;
import com.traveltogether.configservice.service.IQAService;
import com.traveltogether.configservice.service.IUserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
@RequestMapping("/user")
public class UserController {

    @Autowired
    private IUserService iUserService;

    @Autowired
    private IAdsService iAdsService;

    @Autowired
    private IQAService iqaService;

    @GetMapping("/current-user")
    public ResponseEntity<BaseResponse<User>> getCurrentUser(Principal principal) {
        BaseResponse<User> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(iUserService.checkUserLogging(principal));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @PostMapping("/become-localguide")
    public ResponseEntity<BaseResponse<User>> becomeLocalGuide(
            @Valid @RequestBody ObjectIdentifyCardDTO objectIdentifyCardDTO,
            Principal principal) {
        BaseResponse<User> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(iUserService.becomeLocalGuilde(objectIdentifyCardDTO, principal));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @GetMapping("/getUserById")
    public ResponseEntity<BaseResponse<User>> getUserById(@RequestParam(value = "userId") String userId) {
        BaseResponse<User> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(iUserService.getUserById(userId));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @PutMapping("/update-user")
    public ResponseEntity<BaseResponse<User>> updateUser(@Valid @RequestBody User user,
                                                         Principal principal) {
        BaseResponse<User> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(iUserService.updateUser(principal, user));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @PostMapping("/add-blacklst")
    public ResponseEntity<BaseResponse<String>> addBlackLst(@RequestParam(value = "userId") String userId,
                                                            Principal principal) {
        BaseResponse<String> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(iUserService.addBlackLst(principal, userId));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @PostMapping("/report")
    public ResponseEntity<BaseResponse<Report>> report(Principal principal, @RequestBody Report report) {
        BaseResponse<Report> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(iUserService.report(principal, report));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @DeleteMapping("/remove-user-blacklst")
    public ResponseEntity<BaseResponse<String>> removeUserInBlackLst(@RequestParam(value = "userId") String userId,
                                                                     Principal principal) {
        BaseResponse<String> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(iUserService.removeUserBlackLst(principal, userId));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @GetMapping("/getAll-blacklst")
    public ResponseEntity<BaseResponse<List<User>>> getAllBlackLst(Principal principal) {
        BaseResponse<List<User>> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(iUserService.getAllBlackLst(principal));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @GetMapping("/getAll-followers")
    public ResponseEntity<BaseResponse<List<User>>> getAllFollowers(Principal principal) {
        BaseResponse<List<User>> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(iUserService.getAllFollowers(principal));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @GetMapping("/getAll-following")
    public ResponseEntity<BaseResponse<List<User>>> getAllFollowing(Principal principal) {
        BaseResponse<List<User>> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(iUserService.getAllFollowing(principal));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @GetMapping("/getAll-users")
    public ResponseEntity<BaseResponse<List<User>>> getAllUser() {
        BaseResponse<List<User>> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(iUserService.getAllUser());
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @PostMapping("/add-follow")
    public ResponseEntity<BaseResponse<String>> addFollow(@RequestParam(value = "userId") String userId,
                                                          Principal principal) {
        BaseResponse<String> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(iUserService.addFollowing(principal, userId));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @DeleteMapping("/remove-follow")
    public ResponseEntity<BaseResponse<String>> deleteFollow(@RequestParam(value = "userId") String userId,
                                                             Principal principal) {
        BaseResponse<String> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(iUserService.deleteFollowing(principal, userId));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @PostMapping("/change-password")
    public ResponseEntity<BaseResponse<String>> changePassword(@RequestParam(value = "oldPassword") String oldPassword,
                                                               @RequestParam(value = "newPassword") String newPassword,
                                                               Principal principal) {
        BaseResponse<String> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(iUserService.changePasswordUser(oldPassword, newPassword, principal));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @GetMapping("/getAllAdsByLocation")
    public ResponseEntity<BaseResponse<List<User>>> getAllAdsByLocation(@RequestParam("location") String location) {
        BaseResponse<List<User>> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(iAdsService.findByLocation(location));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @PostMapping("/ads/comment")
    public ResponseEntity<BaseResponse<Comment>> commentAds(@Valid @RequestBody Comment comment,
                                                            @RequestParam("adsId") String adsId, @RequestParam("UserIdOfAds") String UserIdOfAds, Principal principal) {
        BaseResponse<Comment> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(iAdsService.commentAds(comment, adsId, UserIdOfAds, principal));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @PostMapping("/ads/like")
    public ResponseEntity<BaseResponse<String>> likeAds(@RequestParam("adsId") String adsId,
                                                        @RequestParam("UserIdOfAds") String UserIdOfAds, Principal principal) {
        BaseResponse<String> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(iAdsService.likeAds(adsId, UserIdOfAds, principal));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @GetMapping("/ads/getById")
    public ResponseEntity<BaseResponse<Ads>> getById(@RequestParam("qaId") String qaId) {
        BaseResponse<Ads> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(iAdsService.findById(qaId));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @PostMapping("/report-ads")
    public ResponseEntity<BaseResponse<Report>> reportAds(@Valid @RequestBody Report report,
                                                          @RequestParam("adsId") String adsId, Principal principal) {
        BaseResponse<Report> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(iAdsService.reportAds(report, adsId, principal));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @PostMapping("/report-qa")
    public ResponseEntity<BaseResponse<Report>> reportQA(@Valid @RequestBody Report report,
                                                         @RequestParam("qaId") String qaId, Principal principal) {
        BaseResponse<Report> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(iqaService.reportQA(report, qaId, principal));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @PostMapping("/read")
    public ResponseEntity<BaseResponse<Boolean>> readNotify(@RequestParam("notifyId") String notifyId, Principal principal) {
        BaseResponse<Boolean> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(iUserService.updateNotify(notifyId, principal));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }
}
