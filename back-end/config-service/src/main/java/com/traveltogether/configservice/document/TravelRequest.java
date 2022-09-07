package com.traveltogether.configservice.document;

import java.util.Date;

import com.traveltogether.configservice.model.EGender;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.traveltogether.configservice.model.ETripType;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Data
public class TravelRequest extends BaseDocument<TravelRequest> {

    private EGender genderLooking;

    private ETripType  tripType;

    private String destination;

    private Date departureDate;

    private Date endDate;

    private String description;

    private boolean active;

    private String userIdCreated;
}
