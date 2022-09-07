package com.traveltogether.configservice.service.impl;

import java.util.List;

import com.traveltogether.configservice.document.Blog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.traveltogether.configservice.document.Notification;
import com.traveltogether.configservice.document.Report;
import com.traveltogether.configservice.document.User;
import com.traveltogether.configservice.model.ETypeReport;
import com.traveltogether.configservice.service.IReportService;

@Service
public class ReportServiceImpl implements IReportService {

    @Autowired
    private MongoOperations mongoOperations;

    @Override
    public Report create(Report report) {
        // TODO Auto-generated method stub
        report.setDescription("description1");
        report.setTypeReport(ETypeReport.USER);
        mongoOperations.insert(report);
        // notification
        Notification notification = new Notification();
        notification.setContent(report.getDescription());
        notification.setPermalink("permalink");
        notification.setRead(false);
        mongoOperations.insert(notification);
        // add notification all role admin
        Query query = new Query();

        return null;
    }

    @Override
    public String skipReport(String EType, String reportId, String id) throws Exception {
        // TODO Auto-generated method stub
        Report report = getById(id);
        mongoOperations.remove(report);
        return "Delete Successfully!";
    }

    @Override
    public Report getById(String id) throws Exception {
        // TODO Auto-generated method stub
        Query query = new Query();
        Report report = mongoOperations.findOne(query.addCriteria(Criteria.where("id").is(id)), Report.class);
        if (report == null) {
            throw new Exception("Not found Report!");
        }
        return report;
    }

    @Override
    public Integer totalReport() {
        List<Report> reports = mongoOperations.findAll(Report.class);
        return reports.size();
    }

}
