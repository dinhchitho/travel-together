package com.traveltogether.configservice.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "like")
public class Like extends BaseDocument<Like> {

    private String userId;

    private String avtUser;

    private String fullName;

    private String username;
}
