package com.traveltogether.configservice.document;

import com.traveltogether.configservice.model.ERole;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "roles")
public class Role {

    @Id
    private String id;

    private ERole name;

    private boolean isCreate = false;
}
