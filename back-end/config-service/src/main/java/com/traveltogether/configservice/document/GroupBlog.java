package com.traveltogether.configservice.document;

import java.util.ArrayList;
import java.util.List;

import lombok.Builder;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "group-blog")
public class GroupBlog extends BaseDocument<GroupBlog> {

    private String name;

    private String location;

    private double lat;

    private double lng;

    private List<Blog> children = new ArrayList<>();

}
