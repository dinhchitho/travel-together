package com.traveltogether.configservice.service.impl;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import com.traveltogether.configservice.document.*;
import com.traveltogether.configservice.service.IReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.traveltogether.configservice.dto.ListNotificationEvent;
import com.traveltogether.configservice.dto.ListNotificationEventAdmin;
import com.traveltogether.configservice.model.ERole;
import com.traveltogether.configservice.model.ETypeNotify;
import com.traveltogether.configservice.repository.IRoleRepository;
import com.traveltogether.configservice.service.IAdsService;
import com.traveltogether.configservice.service.IUserService;
import com.traveltogether.configservice.synchronize.CustomEventPublisher;

@Service
public class AdsServiceImpl implements IAdsService {

    private static final Logger logger = LoggerFactory.getLogger(AdsServiceImpl.class);

    @Autowired
    private IReportService iReportService;

    @Autowired
    private MongoOperations mongoOperations;

    @Autowired
    private IUserService iUserService;

    @Autowired
    private IRoleRepository roleRepository;

    @Autowired
    private CustomEventPublisher customEventPublisher;

    @Override
    public List<User> getAll() throws Exception {
        // TODO Auto-generated method stub
        Query query = new Query();
        Role localGuild = roleRepository.findByName(ERole.ROLE_LOCAL_GUILD)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        query.addCriteria(Criteria.where("roles").elemMatch(Criteria.where("name").is(localGuild.getName())));
        List<User> lstUserLocalGuild = mongoOperations.find(query, User.class);
        if (lstUserLocalGuild.size() > 0) {
            for (User item : lstUserLocalGuild) {
                item.setFollowedUsers(null);
                item.setFollowingUsers(null);
                item.setNotifications(null);
                item.setQas(null);
                item.setBlogs(null);
                item.setBlackListedUsers(null);
            }
        } else {
            logger.info("lst user local guild empty!");
            throw new Exception("lst user local guild empty!");
        }
        return lstUserLocalGuild;
    }

    @Override
    public Ads save(Ads ads, Principal principal) throws Exception {
        // TODO Auto-generated method stub
        User checkUserLogin = iUserService.checkUserLogging(principal);
        ads.setUserIdCreated(checkUserLogin.getId());
        Ads adsSave = mongoOperations.insert(ads);
        User checkSaveUser = null;
        if (checkUserLogin.getAds() != null) {
            checkUserLogin.getAds().add(adsSave);
            checkSaveUser = mongoOperations.save(checkUserLogin);
        } else {
            List<Ads> adsList = new ArrayList<>();
            adsList.add(adsSave);
            checkUserLogin.setAds(adsList);
            checkSaveUser = mongoOperations.save(checkUserLogin);
        }
        return ((adsSave != null) && (checkSaveUser != null)) ? adsSave : null;
    }

    @Override
    public Ads update(Ads ads, Principal principal) throws Exception {
        // TODO Auto-generated method stub
        User checkUserLogin = iUserService.checkUserLogging(principal);
        User checkSaveUser = null;
        Ads checkSaveAds = null;
        Ads checkExistAds = findById(ads.getId());
        checkExistAds.setContent(ads.getContent());
        checkExistAds.setImages(ads.getImages());
        checkExistAds.setVideos(ads.getVideos());
        checkExistAds.setLocation(ads.getLocation());
        checkExistAds.setLat(ads.getLat());
        checkExistAds.setLng(ads.getLng());
        checkExistAds.setUserIdCreated(checkUserLogin.getId());
        checkSaveAds = mongoOperations.save(checkExistAds);
        if (checkUserLogin.getAds().size() > 0) {
            for (Ads itemAds : checkUserLogin.getAds()) {
                if (itemAds.getId().equals(checkSaveAds.getId())) {
                    itemAds.setContent(ads.getContent());
                    itemAds.setImages(ads.getImages());
                    itemAds.setVideos(ads.getVideos());
                    itemAds.setLocation(ads.getLocation());
                    itemAds.setLat(ads.getLat());
                    itemAds.setLng(ads.getLng());
                    itemAds.setUserIdCreated(checkUserLogin.getId());
                    checkSaveUser = mongoOperations.save(checkUserLogin);
                    break;
                }
            }
        }
        return ((checkSaveAds != null) && (checkSaveAds != null)) ? checkSaveAds : null;
    }

    @Override
    public String delete(String adsId, Principal principal) throws Exception {
        // TODO Auto-generated method stub
        User checkUserLogin = iUserService.checkUserLogging(principal);
        Ads checkExistAds = findById(adsId);
        User checkSaveUser = null;
        if (checkUserLogin.getAds().size() > 0) {
            for (Ads eAds : checkUserLogin.getAds()) {
                if (eAds.getId().equals(checkExistAds.getId())) {
                    checkUserLogin.getAds().remove(eAds);
                    checkSaveUser = mongoOperations.save(checkUserLogin);
                    break;
                }
            }
        } else {
            logger.error("lst Ads in user empty!");
            throw new Exception("lst Ads in user empty!");
        }
        return ((mongoOperations.remove(checkExistAds) != null) && (checkSaveUser != null) ? "Delete Ads successfully!"
                : "Delete ads failed!");
    }

    @Override
    public Ads findById(String adsId) throws Exception {
        // TODO Auto-generated method stub
        Query query = new Query();
        Ads ads = mongoOperations.findOne(query.addCriteria(Criteria.where("id").is(adsId)), Ads.class);
        if (ads == null) {
            logger.info("ads not found!");
            throw new Exception("ads not found!");
        }
        return ads;
    }

    @Override
    public List<User> findByLocation(String location) throws Exception {
        // TODO Auto-generated method stub
        List<User> users = mongoOperations.findAll(User.class);
        List<User> usersNew = new ArrayList<>();
        for (User user : users) {
            if (user.getAds() != null) {
                List<Ads> ads = user.getAds();
                List<Ads> adsNew = ads.stream().filter((t) -> t.getLocation().equals(location))
                        .collect(Collectors.toList());
                user.setAds(adsNew);
            }
        }
        if (users.size() > 0) {
            for (User el : users) {
                el.setFollowedUsers(null);
                el.setFollowingUsers(null);
                el.setNotifications(null);
                el.setBlogs(null);
                el.setQas(null);
                // el.setBlackListedUsers(null);
                if (el.getAds() != null && el.getAds().size() > 0) {
                    usersNew.add(el);
                }
            }
        }
        return usersNew;
    }

    @Override
    public String likeAds(String adsId, String UserIdOfAds, Principal principal) throws Exception {
        // TODO Auto-generated method stub
        User checkUserLogin = iUserService.checkUserLogging(principal);
        Ads checkExistAds = findById(adsId);
        User checkUserOfAds = iUserService.getUserById(UserIdOfAds);
        Ads checkSaveAds = null;
        User checkSaveUser = null;
        boolean checkLiked = false;
        if (checkExistAds.getLikedUsers().size() > 0) {
            for (User elLike : checkExistAds.getLikedUsers()) {
                if (elLike.getId().equals(checkUserLogin.getId())) {
                    checkExistAds.getLikedUsers().remove(elLike);
                    checkSaveAds = mongoOperations.save(checkExistAds);
                    checkLiked = true;
                    break;
                }
            }
        }

        if (checkLiked) {
            // remove like ads in user
            if (checkUserOfAds.getAds().size() > 0) {
                for (Ads item : checkUserOfAds.getAds()) {
                    if (item.getId().equals(checkSaveAds.getId())) {
                        for (User el : item.getLikedUsers()) {
                            if (el.getId().equals(checkUserLogin.getId())) {
                                item.getLikedUsers().remove(el);
                                checkSaveUser = mongoOperations.save(checkUserOfAds);
                                break;
                            }
                        }
                    }
                }
            }
        } else {
            // like in ads
            if (checkExistAds.getLikedUsers() != null) {
                checkExistAds.getLikedUsers().add(checkUserLogin);
                checkSaveAds = mongoOperations.save(checkExistAds);
            }
            // like ads in user
            if (checkUserOfAds.getAds().size() > 0) {
                for (Ads elAds : checkUserOfAds.getAds()) {
                    if (elAds.getId().equals(checkSaveAds.getId())) {
                        elAds.getLikedUsers().add(checkUserLogin);
                        checkSaveUser = mongoOperations.save(checkUserOfAds);
                        break;
                    }
                }
            }
            // publish notification
            if ((checkSaveAds != null) && (checkSaveUser != null)) {
                // create notification
                Notification notification = new Notification();
                notification.setContent(" like your ads!");
                notification.setThumbnail(checkUserLogin.getAvatar());
                notification.setPermalink(checkSaveAds.getId());
                notification.setType(ETypeNotify.ADS);
                notification.setFullName(checkUserLogin.getFullName());
                notification.setCreateUser(checkUserLogin.getUsername());
                notification.setCreatedDate(new Date());
                notification.setLastModifiedUser(checkUserLogin.getUsername());
                notification.setUpdateDttm(new Date());
                Notification checkSaveNotify = mongoOperations.insert(notification);
                // check lst notification user
                if (checkUserOfAds.getNotifications() != null) {
                    checkUserOfAds.getNotifications().add(checkSaveNotify);
                }
                mongoOperations.save(checkUserOfAds);
                // publish notification to socket
                ListNotificationEvent listNotificationEvent = new ListNotificationEvent(this,
                        checkUserOfAds.getId(),
                        notification);
                logger.info("save successfully!");
                customEventPublisher.publishCustomEvent(listNotificationEvent);
            }
        }

        return ((checkSaveAds != null) && (checkSaveUser != null)) ? "Like ads successfully!" : "Like ads failed!";
    }

    @Override
    public Comment commentAds(Comment comment, String adsId, String UserIdOfAds, Principal principal)
            throws Exception {
        // TODO Auto-generated method stub
        User checkUserLogin = iUserService.checkUserLogging(principal);
        Ads checkExistAds = findById(adsId);
        User checkUserOfAds = iUserService.getUserById(UserIdOfAds);
        Ads checkSaveAds = null;
        User checkSaveUser = null;
        comment.setUserIdComment(checkUserLogin.getId());
        comment.setUserAvt(checkUserLogin.getAvatar());
        comment.setFullName(checkUserLogin.getFullName());
        comment.setIsLocalGuide(checkUserLogin.isLocalGuide());
        Comment saveComment = mongoOperations.insert(comment);
        // like in ads
        if (checkExistAds.getComments() != null) {
            checkExistAds.getComments().add(saveComment);
            checkSaveAds = mongoOperations.save(checkExistAds);
        }
        // like ads in user
        if (checkUserOfAds.getAds().size() > 0) {
            for (Ads elAds : checkUserOfAds.getAds()) {
                if (elAds.getId().equals(checkSaveAds.getId())) {
                    elAds.getComments().add(saveComment);
                    checkSaveUser = mongoOperations.save(checkUserOfAds);
                    break;
                }
            }
        }
        // publish notification
        if ((checkSaveAds != null) && (checkSaveUser != null) && (saveComment != null)) {
            // create notification
            Notification notification = new Notification();
            notification.setContent(" comment your ads!");
            notification.setThumbnail(checkUserLogin.getAvatar());
            notification.setPermalink(checkSaveAds.getId());
            notification.setType(ETypeNotify.ADS);
            notification.setFullName(checkUserLogin.getFullName());
            notification.setCreateUser(checkUserLogin.getUsername());
            notification.setCreatedDate(new Date());
            notification.setLastModifiedUser(checkUserLogin.getUsername());
            notification.setUpdateDttm(new Date());
            Notification checkSaveNotify = mongoOperations.insert(notification);
            // check lst notification user
            if (checkUserOfAds.getNotifications() != null) {
                checkUserOfAds.getNotifications().add(checkSaveNotify);
            }
            mongoOperations.save(checkUserOfAds);
            // publish notification to socket
            ListNotificationEvent listNotificationEvent = new ListNotificationEvent(this,
                    checkUserOfAds.getId(),
                    notification);
            logger.info("save successfully!");
            customEventPublisher.publishCustomEvent(listNotificationEvent);
        }
        return ((checkSaveAds != null) && (checkSaveUser != null) && (saveComment != null)) ? saveComment : null;
    }

    @Override
    public String banAds(String idReport, String adsId) throws Exception {
        // TODO Auto-generated method stub
        Ads checkAdsBan = findById(adsId);
        checkAdsBan.setBan(true);
        Ads saveAds = mongoOperations.save(checkAdsBan);
        User checkSaveUser = null;
        List<User> users = mongoOperations.findAll(User.class);
        if (users != null) {
            for (User elUser : users) {
                if (elUser.getAds() != null) {
                    for (Ads elAds : elUser.getAds()) {
                        if (saveAds.getId().equals(elAds.getId())) {
                            elAds.setBan(true);
                            checkSaveUser = mongoOperations.save(elUser);
                            break;
                        }
                    }
                }
            }
        }
        Report getByIdReport = iReportService.getById(idReport);
        getByIdReport.setBan(true);
        mongoOperations.save(getByIdReport);
        return ((checkSaveUser != null) && (saveAds != null)) ? "Ban Ads successfully!" : "Ban Ads failed!";
    }

    @Override
    public Report reportAds(Report report, String adsId, Principal principal) throws Exception {
        // TODO Auto-generated method stub
        Ads checkAdsReport = findById(adsId);
        User checkUserLogging = iUserService.checkUserLogging(principal);
        report.setFullName(checkUserLogging.getFullName());
        Report reportSave = mongoOperations.insert(report);
        User checkSaveUser = null;
        Query query = new Query();
        User userOfAds = mongoOperations
                .findOne(query.addCriteria(Criteria.where("id").is(checkAdsReport.getUserIdCreated())), User.class);

        if (userOfAds.getAds().size() > 0) {
            userOfAds.getAds().stream().filter(t -> t.getId().equals(checkAdsReport.getId())).findFirst()
                    .orElseThrow(() -> new Exception("Not found ads in User"));
            checkUserLogging.getReports().add(reportSave);
            checkSaveUser = mongoOperations.save(checkUserLogging);
        }
        // check report blog in group
        // GroupBlog groupBlog = findGroupBlogByLocation(checkBlogReport.getLocation());
        // if (groupBlog.getChildren().size() > 0) {
        // groupBlog.getChildren().stream().filter(t ->
        // t.getId().equals(checkBlogReport.getId())).findFirst()
        // .orElseThrow(() -> new Exception("Not found blog in Group"));
        // }
        // publish notifications
        if (checkSaveUser != null && reportSave != null) {
            // create notification
            Notification notification = new Notification();
            notification.setContent(reportSave.getDescription());
            notification.setThumbnail(checkUserLogging.getAvatar());
            notification.setPermalink(checkAdsReport.getId());
            notification.setType(ETypeNotify.ADS);
            notification.setFullName(checkUserLogging.getFullName());
            notification.setCreateUser(checkUserLogging.getUsername());
            notification.setCreatedDate(new Date());
            notification.setLastModifiedUser(checkUserLogging.getUsername());
            notification.setUpdateDttm(new Date());
            Notification checkSaveNotify = mongoOperations.insert(notification);
            // check lst notification user
            List<User> lstAdmin = iUserService.getAllRoleAdmin();
            if (lstAdmin.size() > 0) {
                for (User admin : lstAdmin) {
                    if (admin.getNotifications() != null && admin.getNotifications().size() > 0) {
                        admin.getNotifications().add(checkSaveNotify);
                    } else if (admin.getNotifications() == null || admin.getNotifications().size() == 0) {
                        List<Notification> notifications = new ArrayList<>();
                        notifications.add(checkSaveNotify);
                        admin.setNotifications(notifications);
                    }
                    mongoOperations.save(admin);
                }
            }
            ListNotificationEventAdmin listNotificationEventAdmin = new ListNotificationEventAdmin(this, "admin",
                    checkSaveNotify);
            logger.info("save successfully!");
            customEventPublisher.publishCustomEventAdmin(listNotificationEventAdmin);
        }
        return checkSaveUser != null ? reportSave : null;
    }

    @Override
    public Integer totalAds() {
        List<Ads> ads = mongoOperations.findAll(Ads.class);
        return ads.size();
    }

}
