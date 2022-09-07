package com.traveltogether.configservice.service.impl;

import com.traveltogether.configservice.config.security.jwt.AuthEntryPointJwt;
import com.traveltogether.configservice.document.Report;
import com.traveltogether.configservice.document.TravelRequest;
import com.traveltogether.configservice.document.User;
import com.traveltogether.configservice.repository.ITravelRequestRepository;
import com.traveltogether.configservice.service.ITravelRequestService;
import com.traveltogether.configservice.service.IUserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TravelRequestImpl implements ITravelRequestService {
    private static final Logger logger = LoggerFactory.getLogger(TravelRequestImpl.class);
    @Autowired
    private MongoOperations mongoOperations;

    @Autowired
    private IUserService iUserService;

    @Transactional(rollbackFor = Exception.class)
    public TravelRequest save(TravelRequest travelRequest, Principal principal) throws Exception {
        User userIsValid = iUserService.checkUserLogging(principal);
        if (userIsValid == null) {
            logger.error("userId not found!");
            throw new Exception("userId not found!");
        }
        // TravelRequest travelRequestValid = getByUserIdCreated(userIdCreated);
        // if (travelRequestValid != null) {
        // logger.error("This user already create travel request!");
        // throw new Exception("This user already create travel request!");
        // }
        travelRequest.setActive(true);
        TravelRequest travelRequestNew = mongoOperations.save(travelRequest);
        userIsValid.setTravelRequest(travelRequestNew);
        User userNew = mongoOperations.save(userIsValid);
        if (userNew.getTravelRequest() != null) {
            logger.info("Create travel request successful!");
        }
        return travelRequestNew;
    }

    @Override
    public List<User> getAllUserCreatedTravelRequest() throws Exception {
        Query query = new Query();
        query.addCriteria(Criteria.where("travelRequest").ne(null));
        List<User> userCreatedTravelRequestList = mongoOperations.find(query, User.class);
        List<User> users = new ArrayList<>();
        if (userCreatedTravelRequestList.size() > 0) {
            for (User user : userCreatedTravelRequestList) {
                    user.setFollowedUsers(null);
                    user.setFollowingUsers(null);
                    user.setBlogs(null);
                    user.setPassword(null);
                    user.setNotifications(null);
                    user.setQas(null);
                    user.setAds(null);
                    for (User item : user.getBlackListedUsers()) {
                        item.setBlogs(null);
                        item.setFollowedUsers(null);
                        item.setFollowingUsers(null);
                        item.setAds(null);
                        item.setQas(null);
                        item.setBlackListedUsers(null);
                        item.setNotifications(null);
                    }
                }
            users = userCreatedTravelRequestList.stream().filter(user -> user.getTravelRequest().isActive()).collect(Collectors.toList());;
            logger.info("Get all user created travelRequest!");
            return users;
        }
        return userCreatedTravelRequestList;
    }

    @Override
    public TravelRequest getByUserIdCreated(String userIdCreated) throws Exception {
        User userIsValid = mongoOperations.findById(userIdCreated, User.class);
        if (userIsValid == null) {
            logger.error("User id is not found!");
            throw new Exception("User id is not found!");
        }
        return userIsValid.getTravelRequest();
    }

    @Override
    public boolean deActiveTravel(Principal principal) throws Exception {
        User user = iUserService.checkUserLogging(principal);
        if (user.getTravelRequest().isActive()) {
            user.getTravelRequest().setActive(false);
        } else {
            user.getTravelRequest().setActive(true);
        }
        User checkSave = mongoOperations.save(user);
        return checkSave.getTravelRequest().isActive();
    }

    @Override
    public Integer totalTravelRequest() {
        List<TravelRequest> travelRequests = mongoOperations.findAll(TravelRequest.class);
        return travelRequests.size();
    }

}
