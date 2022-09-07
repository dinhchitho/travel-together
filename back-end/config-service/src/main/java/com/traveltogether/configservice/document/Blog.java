package com.traveltogether.configservice.document;

import java.util.ArrayList;
import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;

import com.traveltogether.configservice.model.ETypeBlog;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "blog")
public class Blog extends BaseDocument<Blog> {

    private String content;

    private List<String> images = new ArrayList<>();

    private List<String> videos = new ArrayList<>();

    private String location;

    private double lat;

    private double lng;

    private List<Comment> comments = new ArrayList<>();

    private List<User> likedUsers = new ArrayList<>();

    private String userIdCreated;

    private ETypeBlog eTypeBlog;

    private boolean isBan = false;

    private String fullName;

    private String avt;

    private boolean isLocalGuild = false;

}
