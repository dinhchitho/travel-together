package com.traveltogether.configservice.service;

import com.traveltogether.configservice.document.Report;

public interface IReportService {

    Report create(Report report);

    String skipReport(String EType, String reportId, String id) throws Exception;

    Report getById(String id) throws Exception;

    Integer totalReport();
}
