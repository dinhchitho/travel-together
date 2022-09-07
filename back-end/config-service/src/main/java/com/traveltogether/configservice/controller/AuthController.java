package com.traveltogether.configservice.controller;

import com.traveltogether.configservice.config.security.jwt.JwtUtils;
import com.traveltogether.configservice.config.security.service.impl.UserDetailsImpl;
import com.traveltogether.configservice.document.Role;
import com.traveltogether.configservice.document.User;
import com.traveltogether.configservice.model.ERole;
import com.traveltogether.configservice.payload.request.LoginExternalRequest;
import com.traveltogether.configservice.payload.request.LoginRequest;
import com.traveltogether.configservice.payload.request.SignupRequest;
import com.traveltogether.configservice.payload.response.BaseError;
import com.traveltogether.configservice.payload.response.BaseResponse;
import com.traveltogether.configservice.payload.response.JwtResponse;
import com.traveltogether.configservice.payload.response.MessageResponse;
import com.traveltogether.configservice.repository.IRoleRepository;
import com.traveltogether.configservice.repository.UserDetailRepository;

import com.traveltogether.configservice.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    UserDetailRepository userRepository;

    @Autowired
    private IUserService iUserService;

    @Autowired
    PasswordEncoder encoder;

    @PostMapping("/signin")
    public ResponseEntity<BaseResponse<JwtResponse>> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        BaseResponse<JwtResponse> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(this.iUserService.authenticateUser(loginRequest));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), HttpStatus.EXPECTATION_FAILED.toString()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<BaseResponse<User>> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        BaseResponse<User> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(this.iUserService.registerUser(signUpRequest));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @PostMapping("/signin/external")
    public ResponseEntity<BaseResponse<JwtResponse>> authenticateExternal(@Valid @RequestBody LoginExternalRequest loginRequest) {

        BaseResponse<JwtResponse> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(this.iUserService.authenticateUserExternal(loginRequest));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), HttpStatus.EXPECTATION_FAILED.toString()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }
}
