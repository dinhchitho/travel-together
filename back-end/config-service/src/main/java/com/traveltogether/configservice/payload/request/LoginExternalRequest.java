package com.traveltogether.configservice.payload.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.Size;

@Getter
@Setter
public class LoginExternalRequest {

    private String username;

    private String fullName;

    @Size(max = 50)
    @Email
    private String email;

    private String imageAvatar;

    private String phone;

}
