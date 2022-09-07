package com.traveltogether.configservice.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "interest")
public class Interest extends BaseDocument<Interest> {
    
    private String name;

    private String icon;
}
