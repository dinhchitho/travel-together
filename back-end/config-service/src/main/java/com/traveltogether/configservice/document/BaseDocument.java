package com.traveltogether.configservice.document;

import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Document
public class BaseDocument<T> {

    @Id
    public String id;

    @CreatedBy
    private String createUser;

    @CreatedDate
    private Date createdDate;

    @LastModifiedBy
    private String lastModifiedUser;

    @LastModifiedDate
    private Date updateDttm;
}
