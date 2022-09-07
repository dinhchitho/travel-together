package com.traveltogether.configservice.converter;

import com.traveltogether.configservice.document.AddressEntities;
import com.traveltogether.configservice.dto.AddressEntitiesDTO;

public class ConvertDTOToDocument {
    
    public AddressEntities convertDtoToDocument(AddressEntitiesDTO addressEntitiesDTO) {
        AddressEntities addressEntities = new AddressEntities();
        addressEntities.setDistrict(addressEntitiesDTO.getDistrict());
        addressEntities.setProvince(addressEntitiesDTO.getProvince());
        addressEntities.setStreet(addressEntitiesDTO.getStreet());
        addressEntities.setWard(addressEntitiesDTO.getWard());
        return addressEntities;
    }

}
