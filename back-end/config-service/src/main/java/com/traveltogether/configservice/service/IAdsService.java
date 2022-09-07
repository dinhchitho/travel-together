package com.traveltogether.configservice.service;

import java.security.Principal;
import java.util.List;

import com.traveltogether.configservice.document.Ads;
import com.traveltogether.configservice.document.Comment;
import com.traveltogether.configservice.document.Report;
import com.traveltogether.configservice.document.User;

public interface IAdsService {
    List<User> getAll() throws Exception;

    Ads save(Ads ads, Principal principal) throws Exception;

    Ads update(Ads ads, Principal principal) throws Exception;

    String delete(String adsId, Principal principal) throws Exception;

    Ads findById(String adsId) throws Exception;

    List<User> findByLocation(String location) throws Exception;

    String likeAds(String adsId, String UserIdOfAds, Principal principal) throws Exception;

    Comment commentAds(Comment comment, String adsId, String UserIdOfAds, Principal principal) throws Exception;

    String banAds(String idReport, String adsId) throws Exception;

    Report reportAds(Report report, String adsId, Principal principal) throws Exception;

    Integer totalAds();
}
