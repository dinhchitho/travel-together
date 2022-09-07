package com.traveltogether.configservice.repository.impl;

import com.traveltogether.configservice.document.TravelRequest;
import org.springframework.stereotype.Repository;

import com.traveltogether.configservice.repository.ITravelRequestRepository;

@Repository
public class TravelRequestRepositoryImpl implements ITravelRequestRepository{

    @Override
    public TravelRequest save(TravelRequest travelRequest) {
        return null;
    }
}
