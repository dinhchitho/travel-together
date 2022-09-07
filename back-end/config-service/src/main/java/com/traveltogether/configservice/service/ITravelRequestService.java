package com.traveltogether.configservice.service;

import com.traveltogether.configservice.document.TravelRequest;
import com.traveltogether.configservice.document.User;

import java.security.Principal;
import java.util.List;

public interface ITravelRequestService {

    TravelRequest save(TravelRequest travelRequest, Principal principal) throws Exception;

    List<User> getAllUserCreatedTravelRequest() throws Exception;

    TravelRequest getByUserIdCreated(String userIdCreated) throws Exception;

    boolean deActiveTravel(Principal principal) throws Exception;

    Integer totalTravelRequest();
}
