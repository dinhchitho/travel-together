package com.traveltogether.configservice.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "comment")
public class Comment extends BaseDocument<Comment> {

    private String content;

    private String userIdComment;

    private String userAvt;

    private String fullName;

    private Boolean isLocalGuide;

}
