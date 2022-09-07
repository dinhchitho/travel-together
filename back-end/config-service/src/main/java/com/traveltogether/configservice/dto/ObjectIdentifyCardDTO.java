package com.traveltogether.configservice.dto;

import java.util.Date;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ObjectIdentifyCardDTO {

    private String id;

    private String name;

    private String dob;

    private String sex;

    private String home;

    private String address;

    private AddressEntitiesDTO address_entities;

    private String type;

}
