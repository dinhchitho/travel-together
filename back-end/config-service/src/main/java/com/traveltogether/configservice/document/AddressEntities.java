package com.traveltogether.configservice.document;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class AddressEntities {
    private String province;

    private String district;

    private String ward;

    private String street;
}
