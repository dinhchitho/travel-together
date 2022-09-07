package com.traveltogether.configservice.service;

import java.security.Principal;
import java.util.List;

import com.traveltogether.configservice.document.Comment;
import com.traveltogether.configservice.document.Like;
import com.traveltogether.configservice.document.QA;
import com.traveltogether.configservice.document.Report;
import com.traveltogether.configservice.document.User;

public interface IQAService {

    QA save(QA qa, Principal principal) throws Exception;

    QA findById(String qaId) throws Exception;

    QA update(QA qa, Principal principal) throws Exception;

    String deleteById(String qaId, Principal principal) throws Exception;

    Like like(String qaId, String userIdOfQA, Principal principal) throws Exception;

    Comment commentQA(Comment comment, String qaId, String userIdOfQA, Principal principal) throws Exception;

    List<User> findByLocation(String location) throws Exception;

    String banQA(String idReport, String qaId) throws Exception;

    List<User> getAll() throws Exception;

    Report reportQA(Report report, String qaId, Principal principal) throws Exception;

    Integer totalQA();
}
