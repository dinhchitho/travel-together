package com.traveltogether.configservice.document;

import java.util.ArrayList;
import java.util.List;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "ads")
public class Ads extends BaseDocument<Ads> {

    private String content;

    private List<String> images = new ArrayList<>();

    private List<String> videos = new ArrayList<>();

    private String location;

    private double lat;

    private double lng;

    private List<User> likedUsers = new ArrayList<>();

    private List<Comment> comments = new ArrayList<>();

    private String userIdCreated;

    private boolean isBan = false;

    private boolean isLocalGuild = false;
}
