package com.traveltogether.configservice.service.impl;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collector;
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
import com.traveltogether.configservice.service.IQAService;
import com.traveltogether.configservice.service.IUserService;
import com.traveltogether.configservice.synchronize.CustomEventPublisher;

import lombok.RequiredArgsConstructor;

@Service
public class QAServiceImpl implements IQAService {

    private static final Logger logger = LoggerFactory.getLogger(QAServiceImpl.class);

    @Autowired
    private IReportService iReportService;

    @Autowired
    private MongoOperations mongoOperations;

    @Autowired
    private IUserService iUserService;

    @Autowired
    private CustomEventPublisher customEventPublisher;

    @Override
    public QA save(QA qa, Principal principal) throws Exception {
        // TODO Auto-generated method stub
        User checkUserLogin = iUserService.checkUserLogging(principal);
        qa.setUserIdCreated(checkUserLogin.getId());
        for (Role role : checkUserLogin.getRoles()) {
            if (role.getName().equals(ERole.ROLE_LOCAL_GUILD)) {
                qa.setLocalGuild(true);
            }
        }
        QA checkSaveQA = mongoOperations.insert(qa);
        if (checkUserLogin.getQas() != null && checkSaveQA != null) {
            checkUserLogin.getQas().add(checkSaveQA);
            mongoOperations.save(checkUserLogin);
        }
        return checkSaveQA;
    }

    @Override
    public QA findById(String qaId) throws Exception {
        // TODO Auto-generated method stub
        Query query = new Query();
        QA qa = mongoOperations.findOne(query.addCriteria(Criteria.where("id").is(qaId)), QA.class);
        if (qa == null) {
            logger.info("QA not found!");
            throw new Exception("QA not found!");
        }
        return qa;
    }

    @Override
    public String deleteById(String qaId, Principal principal) throws Exception {
        // TODO Auto-generated method stub
        QA qa = findById(qaId);
        User checkUserLogin = iUserService.checkUserLogging(principal);
        User checkSaveUser = null;
        if (checkUserLogin.getQas() != null && qa != null) {
            for (QA item : checkUserLogin.getQas()) {
                if (item.getId().equals(qa.getId())) {
                    checkUserLogin.getQas().remove(item);
                    checkSaveUser = mongoOperations.save(checkUserLogin);
                    break;
                }
            }
        }
        return ((mongoOperations.remove(qa) != null) && (checkSaveUser != null)) ? "Delete QA successfully!"
                : "Delete QA failed!";
    }

    @Override
    public QA update(QA qa, Principal principal) throws Exception {
        // TODO Auto-generated method stub
        User checkUserLogin = iUserService.checkUserLogging(principal);
        QA checkQA = findById(qa.getId());
        QA checkSaveQA = null;
        User checkSaveUser = null;
        if (checkUserLogin.getQas().size() > 0 && checkQA != null) {
            checkQA.setContent(qa.getContent());
            checkQA.setImages(qa.getImages());
            checkQA.setLocation(qa.getLocation());
            checkQA.setLat(qa.getLat());
            checkQA.setLng(qa.getLng());
            checkSaveQA = mongoOperations.save(checkQA);
            for (QA item : checkUserLogin.getQas()) {
                if (checkSaveQA.getId().equals(item.getId())) {
                    item.setContent(qa.getContent());
                    item.setImages(qa.getImages());
                    item.setLocation(qa.getLocation());
                    item.setLat(qa.getLat());
                    item.setLng(qa.getLng());
                    checkSaveUser = mongoOperations.save(checkUserLogin);
                    break;
                }
            }
        }
        return ((checkSaveQA != null) && (checkSaveUser != null)) ? checkSaveQA : null;
    }

    @Override
    public Like like(String qaId, String userIdOfQA, Principal principal) throws Exception {
        // TODO Auto-generated method stub
        User checkUserLogin = iUserService.checkUserLogging(principal);
        User checkUserOfQA = iUserService.getUserById(userIdOfQA);
        Like like = new Like();
        like.setUserId(checkUserLogin.getId());
        like.setAvtUser(checkUserLogin.getAvatar());
        like.setFullName(checkUserLogin.getFullName());
        like.setUsername(checkUserLogin.getUsername());

        QA checkQA = findById(qaId);
        User checkSaveUser = null;
        QA checkSaveQA = null;
        boolean checkLike = false;
        if (checkQA.getLikes().size() > 0) {
            for (Like elLike : checkQA.getLikes()) {
                if (elLike.getUserId().equals(checkUserLogin.getId())) {
                    checkQA.getLikes().remove(elLike);
                    checkSaveQA = mongoOperations.save(checkQA);
                    checkLike = true;
                    break;
                }
            }
        }

        if (checkLike) {
            // save rating in user
            if (checkUserOfQA.getQas().size() > 0) {
                for (QA itemQa : checkUserOfQA.getQas()) {
                    if (itemQa.getId().equals(checkSaveQA.getId()) && itemQa.getLikes() != null) {
                        for (Like elLike : itemQa.getLikes()) {
                            itemQa.getLikes().remove(elLike);
                            checkSaveUser = mongoOperations.save(checkUserOfQA);
                            break;
                        }
                    }
                }
            }
        } else {
            Like likeSave = mongoOperations.insert(like);
            // save rating in qa
            if (checkQA.getLikes() != null) {
                checkQA.getLikes().add(likeSave);
                checkSaveQA = mongoOperations.save(checkQA);
            }
            // save rating in user
            if (checkUserOfQA.getQas().size() > 0) {
                for (QA itemQa : checkUserOfQA.getQas()) {
                    if (itemQa.getId().equals(checkSaveQA.getId()) && itemQa.getLikes() != null) {
                        itemQa.getLikes().add(likeSave);
                        checkSaveUser = mongoOperations.save(checkUserOfQA);
                        break;
                    }
                }
            }
            if (checkSaveUser != null) {
                // publish Notification
                // create notification
                Notification notification = new Notification();
                notification.setContent(" like your question!");
                notification.setThumbnail(checkUserLogin.getAvatar());
                notification.setPermalink(checkSaveQA.getId());
                notification.setType(ETypeNotify.QA);
                notification.setFullName(checkUserLogin.getFullName());
                notification.setCreateUser(checkUserLogin.getUsername());
                notification.setCreatedDate(new Date());
                notification.setLastModifiedUser(checkUserLogin.getUsername());
                notification.setUpdateDttm(new Date());
                Notification checkSaveNotify = mongoOperations.insert(notification);
                // check lst notification user
                if (checkUserOfQA.getNotifications() != null) {
                    checkUserOfQA.getNotifications().add(checkSaveNotify);
                }
                mongoOperations.save(checkUserOfQA);
                // publish notification to socket
                ListNotificationEvent listNotificationEvent = new ListNotificationEvent(this,
                        checkUserOfQA.getId(),
                        checkSaveNotify);
                logger.info("save successfully!");
                customEventPublisher.publishCustomEvent(listNotificationEvent);
            }
        }

        return checkSaveUser != null && like != null ? like : null;
    }

    @Override
    public Comment commentQA(Comment comment, String qaId, String userIdOfQA, Principal principal) throws Exception {
        // TODO Auto-generated method stub
        User checkUserLogin = iUserService.checkUserLogging(principal);
        User checkUserOfQA = iUserService.getUserById(userIdOfQA);
        comment.setUserIdComment(checkUserLogin.getId());
        comment.setUserAvt(checkUserLogin.getAvatar());
        comment.setFullName(checkUserLogin.getFullName());
        comment.setIsLocalGuide(checkUserLogin.isLocalGuide());
        Comment commentSave = mongoOperations.insert(comment);
        QA checkQA = findById(qaId);
        QA checkSaveQA = null;
        User checkSaveUser = null;
        // check save comment in qa
        if (checkQA.getComments() != null) {
            checkQA.getComments().add(commentSave);
            checkSaveQA = mongoOperations.save(checkQA);
        }
        // check save comment in user
        if (checkUserOfQA.getQas().size() > 0 && commentSave != null) {
            for (QA itemQa : checkUserOfQA.getQas()) {
                if (itemQa.getId().equals(checkSaveQA.getId()) && itemQa.getComments() != null) {
                    itemQa.getComments().add(commentSave);
                    checkSaveUser = mongoOperations.save(checkUserOfQA);
                    break;
                }
            }
        }
        if ((checkSaveQA != null) && (checkSaveUser != null) && (commentSave != null)) {
            // publish notification
            // create notification
            Notification notification = new Notification();
            notification.setContent(" comment your qa!");
            notification.setThumbnail(checkUserLogin.getAvatar());
            notification.setPermalink(checkSaveQA.getId());
            notification.setType(ETypeNotify.QA);
            notification.setFullName(checkUserLogin.getFullName());
            notification.setCreateUser(checkUserLogin.getUsername());
            notification.setCreatedDate(new Date());
            notification.setLastModifiedUser(checkUserLogin.getUsername());
            notification.setUpdateDttm(new Date());
            Notification checkSaveNotify = mongoOperations.insert(notification);
            // check lst notification user
            if (checkUserOfQA.getNotifications() != null) {
                checkUserOfQA.getNotifications().add(checkSaveNotify);
            }
            mongoOperations.save(checkUserOfQA);
            // publish notification to socket
            ListNotificationEvent listNotificationEvent = new ListNotificationEvent(this,
                    checkUserOfQA.getId(),
                    checkSaveNotify);
            logger.info("save successfully!");
            customEventPublisher.publishCustomEvent(listNotificationEvent);
        }
        return ((checkSaveQA != null) && (checkSaveUser != null) && (commentSave != null)) ? commentSave : null;
    }

    @Override
    public List<User> findByLocation(String location) throws Exception {
        // TODO Auto-generated method stub
        List<User> users = mongoOperations.findAll(User.class);
        List<User> usersNew = new ArrayList<>();
        for (User user : users) {
            if (user.getQas() != null) {
                List<QA> qas = user.getQas();
                List<QA> qasNew = qas.stream().filter((t) -> t.getLocation().equals(location))
                        .collect(Collectors.toList());
                user.setQas(qasNew);
            }
        }
        if (users.size() > 0) {
            for (User el : users) {
                el.setFollowedUsers(null);
                el.setFollowingUsers(null);
                el.setNotifications(null);
                el.setBlogs(null);
                el.setAds(null);
                // el.setBlackListedUsers(null);
                if (el.getQas().size() > 0) {
                    usersNew.add(el);
                }
            }
        }
        return usersNew;
    }

    @Override
    public String banQA(String idReport, String qaId) throws Exception {
        // TODO Auto-generated method stub
        QA checkQABan = findById(qaId);
        checkQABan.setBan(true);
        QA saveQA = mongoOperations.save(checkQABan);
        User checkSaveUser = null;
        List<User> users = mongoOperations.findAll(User.class);
        if (users != null) {
            for (User elUser : users) {
                for (QA elQa : elUser.getQas()) {
                    if (checkQABan.getId().equals(elQa.getId())) {
                        elQa.setBan(true);
                        checkSaveUser = mongoOperations.save(elUser);
                        break;
                    }
                }
            }
        }
        Report getByIdReport = iReportService.getById(idReport);
        getByIdReport.setBan(true);
        mongoOperations.save(getByIdReport);
        return ((checkSaveUser != null) && (saveQA != null)) ? "Ban QA successfully!" : "Ban QA failed!";
    }

    @Override
    public List<User> getAll() throws Exception {
        // TODO Auto-generated method stub
        Query query = new Query();
        query.addCriteria(Criteria.where("qas").ne(null));
        List<User> users = mongoOperations.find(query, User.class);
        if (users.size() > 0) {
            for (User user : users) {
                user.setFollowedUsers(null);
                user.setFollowingUsers(null);
                user.setBlogs(null);
                user.setPassword(null);
                user.setNotifications(null);
                user.setBlackListedUsers(null);
                user.setAds(null);
            }
            logger.info("Get all user qas!");
        }
        return users;
    }

    @Override
    public Report reportQA(Report report, String qaId, Principal principal) throws Exception {
        // TODO Auto-generated method stub
        // TODO Auto-generated method stub
        QA checkQAReport = findById(qaId);
        User checkUserLogging = iUserService.checkUserLogging(principal);
        report.setFullName(checkUserLogging.getFullName());
        Report reportSave = mongoOperations.insert(report);
        User checkSaveUser = null;
        Query query = new Query();
        User userOfQA = mongoOperations
                .findOne(query.addCriteria(Criteria.where("id").is(checkQAReport.getUserIdCreated())), User.class);

        if (userOfQA.getQas().size() > 0) {
            userOfQA.getQas().stream().filter(t -> t.getId().equals(checkQAReport.getId())).findFirst()
                    .orElseThrow(() -> new Exception("Not found qa in User"));
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
            notification.setPermalink(checkQAReport.getId());
            notification.setType(ETypeNotify.QA);
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
    public Integer totalQA() {
        List<QA> qas = mongoOperations.findAll(QA.class);
        return qas.size();
    }

}
