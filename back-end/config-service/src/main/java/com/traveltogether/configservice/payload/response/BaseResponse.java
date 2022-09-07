package com.traveltogether.configservice.payload.response;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;

@Getter
@Setter
public class BaseResponse<T> {
    private boolean success;
    private T data;
    private ArrayList<BaseError> error = new ArrayList<>();

    public void addError(BaseError error) {
        this.error.add(error);
    }
}
