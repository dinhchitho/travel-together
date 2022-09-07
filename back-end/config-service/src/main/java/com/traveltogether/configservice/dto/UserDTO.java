package com.traveltogether.configservice.dto;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.traveltogether.configservice.document.AddressEntities;
import com.traveltogether.configservice.document.Blog;
import com.traveltogether.configservice.document.Interest;
import com.traveltogether.configservice.document.Notification;
import com.traveltogether.configservice.document.Report;
import com.traveltogether.configservice.document.TravelRequest;
import com.traveltogether.configservice.document.User;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {
    private String id;

    private String username;

    private String email;
    private String password;

    private String fullName;

    private boolean gender;

    private Date dob;

    private String phone;

    private String avatar;

    private String coverPhoto;

    private String country;

    private String countryIcon;

    private String bio;

    private String weight;

    private String height;

    private boolean isMarried;

    private List<User> blackListedUsers;

    private List<Blog> blogs = new ArrayList<>();

    private List<Report> reports;

    private boolean isDisable = false;

    private List<Interest> interests;

    private List<Notification> notifications;

    private boolean hasSubmitID = false;

    private String origin_place;

    private String residence_place;

    private Date issued_date;

    private String identify_card_id;

    private List<User> followingUsers;

    private List<User> followedUsers;

    private TravelRequest travelRequest;

    private AddressEntities address_entities;

    private boolean isLocalGuide = false;

    private boolean hasUpdated = false;
}
