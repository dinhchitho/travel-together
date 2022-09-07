package com.traveltogether.configservice.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class SendSMSDto {
    private String userId;
    private String otp;
}
