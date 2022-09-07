package com.traveltogether.configservice.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class Total {
    private int totalUser;
    private int totalBLog;
    private int totalQa;
    private int totalAds;
    private int totalReport;
    private int totalTravel;
}
