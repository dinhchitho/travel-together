package com.traveltogether.configservice.document;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import com.traveltogether.configservice.model.ETypeReport;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "report")
public class Report extends BaseDocument<Report> {

    private ETypeReport typeReport;

    private String type;

    private String reportId;

    private String description;

    private boolean isBan = false;

    private String fullName;
}
