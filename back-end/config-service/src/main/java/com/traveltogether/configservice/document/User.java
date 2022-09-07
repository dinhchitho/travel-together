package com.traveltogether.configservice.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "user")
public class User {

    @Id
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

    private List<User> blackListedUsers = new ArrayList<>();

    private List<Blog> blogs = new ArrayList<>();

    private List<QA> qas = new ArrayList<>();

    private List<Ads> ads;

    private List<Report> reports = new ArrayList<>();

    private boolean isDisable = false;

    private List<Interest> interests;

    private List<Notification> notifications = new ArrayList<>();

    private boolean hasSubmitID = false;

    private String origin_place;

    private String residence_place;

    private Date issued_date;

    private String identify_card_id;

    private List<User> followingUsers = new ArrayList<>();

    private List<User> followedUsers = new ArrayList<>();

    private TravelRequest travelRequest;

    private AddressEntities address_entities;

    private boolean isLocalGuide = false;

    private boolean hasUpdated = false;

    private Set<Role> roles = new HashSet<>();

    public User(String username, String email, String password, String phone, String fullName) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.fullName = fullName;
    }

    public User(String id, String username) {
        this.id = id;
        this.username = username;
    }

}
