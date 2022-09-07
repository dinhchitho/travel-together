package com.traveltogether.configservice.document;

import java.io.Serializable;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.traveltogether.configservice.model.ETypeNotify;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "notification")
@Data
public class Notification extends BaseDocument<Notification> implements Serializable {

    private static final long serialVersionUID = 5762431103826187890L;

    private String content;

    private String thumbnail;

    private boolean isRead = false;

    private String permalink;

    private ETypeNotify type;

    private String fullName;
}
