package com.traveltogether.configservice.payload.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BaseError {
    private String code;
    private String message;

    public BaseError(String code, String message) {
        this.code = code;
        this.message = message;
    }
}
