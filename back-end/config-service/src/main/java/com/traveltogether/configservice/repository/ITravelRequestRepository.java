package com.traveltogether.configservice.repository;

import com.traveltogether.configservice.document.TravelRequest;


public interface ITravelRequestRepository {
    TravelRequest save(TravelRequest travelRequest);
}
