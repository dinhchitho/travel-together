package com.traveltogether.configservice.service.impl;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.traveltogether.configservice.document.*;
import com.traveltogether.configservice.service.IReportService;
import com.traveltogether.configservice.utils.Helper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.traveltogether.configservice.dto.ListNotificationEvent;
import com.traveltogether.configservice.dto.ListNotificationEventAdmin;
import com.traveltogether.configservice.model.ERole;
import com.traveltogether.configservice.model.ETypeNotify;
import com.traveltogether.configservice.service.IBlogService;
import com.traveltogether.configservice.service.ICommentService;
import com.traveltogether.configservice.service.IUserService;
import com.traveltogether.configservice.synchronize.CustomEventPublisher;

@Service
public class BlogServiceImpl implements IBlogService {

    private static final Logger logger = LoggerFactory.getLogger(BlogServiceImpl.class);

    @Autowired
    private IReportService iReportService;

    @Autowired
    private MongoOperations mongoOperations;

    @Autowired
    private ICommentService iCommentService;

    @Autowired
    private IUserService iUserService;

    @Autowired
    private CustomEventPublisher customEventPublisher;

    @Override
    public Blog findById(String id) throws Exception {
        // TODO Auto-generated method stub
        Query query = new Query();
        Blog blog = mongoOperations.findOne(query.addCriteria(Criteria.where("id").is(id)), Blog.class);
        if (blog == null) {
            logger.info("Blog not found!");
            throw new Exception("Blog not found!");
        }
        return blog;
    }

    @Override
    public List<User> getAll() {
        // TODO Auto-generated method stub
        List<User> users = mongoOperations.findAll(User.class);
        List<User> userReturn = new ArrayList<>();
        if (users != null) {
            for (User user : users) {
                // if (user.getBlogs().size() > 0 || user.getQas().size() > 0) {
                user.setFollowedUsers(null);
                user.setFollowingUsers(null);
                user.setNotifications(null);
                user.setPassword("");
                user.setReports(null);
                // user.setQas(null);
                // user.setAds(null);
                for (Blog blog : user.getBlogs()) {
                    if (blog.getLikedUsers().size() > 0) {
                        for (User userLike : blog.getLikedUsers()) {
                            userLike.setFollowedUsers(null);
                            userLike.setFollowingUsers(null);
                            userLike.setNotifications(null);
                            userLike.setBlogs(null);
                            userLike.setReports(null);
                            userLike.setBlackListedUsers(null);
                            userLike.setQas(null);
                            userLike.setAds(null);
                        }
                    }
                }

                if (user.getAds() != null) {
                    for (Ads ads : user.getAds()) {
                        if (ads.getLikedUsers().size() > 0) {
                            for (User userLike : ads.getLikedUsers()) {
                                userLike.setFollowedUsers(null);
                                userLike.setFollowingUsers(null);
                                userLike.setNotifications(null);
                                userLike.setBlogs(null);
                                userLike.setReports(null);
                                userLike.setBlackListedUsers(null);
                                userLike.setQas(null);
                                userLike.setAds(null);
                            }
                        }
                    }
                }
                // }
                userReturn.add(user);
            }
        }
        return userReturn;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Blog save(Blog blog, Principal principal) throws Exception {
        // TODO Auto-generated method stub
        User checkUserLogging = iUserService.checkUserLogging(principal);
        blog.setFullName(checkUserLogging.getFullName());
        blog.setAvt(checkUserLogging.getAvatar());
        blog.setUserIdCreated(checkUserLogging.getId());
        for (Role role : checkUserLogging.getRoles()) {
            if (role.getName().equals(ERole.ROLE_LOCAL_GUILD)) {
                blog.setLocalGuild(true);
            }
        }
        Blog checkSave = mongoOperations.save(blog);
        List<GroupBlog> blogs = mongoOperations.findAll(GroupBlog.class);
        if (blogs != null && blogs.size() > 0) {
            Query query = new Query();
            GroupBlog checkExistBlog = mongoOperations.findOne(
                    query.addCriteria(Criteria.where("location").is(checkSave.getLocation())),
                    GroupBlog.class);
            if (checkExistBlog != null) {
                checkExistBlog.getChildren().add(checkSave);
                mongoOperations.save(checkExistBlog);
            } else {
                GroupBlog groupBlogNew = new GroupBlog();
                // groupBlog.setName();
                groupBlogNew.setLat(checkSave.getLat());
                groupBlogNew.setLng(checkSave.getLng());
                groupBlogNew.setLocation(checkSave.getLocation());
                groupBlogNew.getChildren().add(checkSave);
                mongoOperations.insert(groupBlogNew);
            }
        } else {
            GroupBlog groupBlog = new GroupBlog();
            // groupBlog.setName();
            groupBlog.setLat(checkSave.getLat());
            groupBlog.setLng(checkSave.getLng());
            groupBlog.setLocation(checkSave.getLocation());
            groupBlog.getChildren().add(checkSave);
            mongoOperations.insert(groupBlog);
        }

        if (checkUserLogging.getBlogs() != null) {
            checkUserLogging.getBlogs().add(checkSave);
        } else {
            List<Blog> lstBLog = new ArrayList<>();
            lstBLog.add(checkSave);
            checkUserLogging.setBlogs(lstBLog);
        }
        mongoOperations.save(checkUserLogging);
        return checkSave;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Blog update(Blog blog, Principal principal) throws Exception {
        // TODO Auto-generated method stub
        String newLocation = blog.getLocation().replace("%2B", "+");
        User checkUserLogging = iUserService.checkUserLogging(principal);
        Blog checkSaveBlog = null;
        User checkSaveUser = null;
        GroupBlog checkSaveGroupBlog = null;
        // check blog in user
        if (checkUserLogging.getBlogs().size() > 0) {
            Query query = new Query();
            query.addCriteria(Criteria.where("blogs").elemMatch(Criteria.where("id").is(blog.getId())));
            User userExist = mongoOperations.findOne(query, User.class);
            if (userExist != null) {
                for (Blog item : checkUserLogging.getBlogs()) {
                    if (item.getId().equals(blog.getId())) {
                        logger.info("Get blog id" + item.getId() + " in user");
                        item.setContent(blog.getContent());
                        item.setImages(blog.getImages());
                        item.setVideos(blog.getVideos());
                        item.setLocation(newLocation);
                        item.setLat(blog.getLat());
                        item.setLng(blog.getLng());
                        checkSaveUser = mongoOperations.save(checkUserLogging);
                        break;
                    }
                }
            } else {
                logger.error("Not found blog in user!");
                throw new Exception("Not found blog in user!");
            }
        } else {
            logger.error("Lst blog in user empty!");
            throw new Exception("Lst blog in user empty!");
        }
        // check blog in blog
        Blog checkExistBlog = findById(blog.getId());
        Blog checkBlogExist = findById(blog.getId());
        if (checkBlogExist != null) {
            logger.info("Get blog id" + checkBlogExist.getId() + " in blog");
            checkBlogExist.setContent(blog.getContent());
            checkBlogExist.setImages(blog.getImages());
            checkBlogExist.setVideos(blog.getVideos());
            checkBlogExist.setLocation(newLocation);
            checkBlogExist.setLat(blog.getLat());
            checkBlogExist.setLng(blog.getLng());
            checkSaveBlog = mongoOperations.save(checkBlogExist);
        }
        // check blog in group blog
        Query query = new Query();
        GroupBlog groupBlog = mongoOperations.findOne(query.addCriteria(Criteria.where("location").is(newLocation)),
                GroupBlog.class);
        if (groupBlog != null) {
            GroupBlog checkBlogChildren = mongoOperations.findOne(query.addCriteria(Criteria.where("children")
                    .elemMatch(Criteria.where("id").is(checkBlogExist.getId()))), GroupBlog.class);
            if (checkBlogChildren != null) {
                for (Blog eBlog : groupBlog.getChildren()) {
                    if (eBlog.getId().equals(checkBlogExist.getId())) {
                        logger.info("Get blog id" + eBlog.getId() + " in group");
                        eBlog.setContent(blog.getContent());
                        eBlog.setImages(blog.getImages());
                        eBlog.setVideos(blog.getVideos());
                        eBlog.setLocation(newLocation);
                        eBlog.setLat(blog.getLat());
                        eBlog.setLng(blog.getLng());
                        checkSaveGroupBlog = mongoOperations.save(groupBlog);
                        logger.info("Save checkBlogChildren != null successfully!");
                        break;
                    }
                }
            } else {
                groupBlog.getChildren().add(checkSaveBlog);
                checkSaveGroupBlog = mongoOperations.save(groupBlog);
                logger.info("Save checkBlogChildren == null successfully!");
            }
        } else {
            GroupBlog newGroup = new GroupBlog();
            newGroup.setLat(checkSaveBlog.getLat());
            newGroup.setLng(checkSaveBlog.getLng());
            newGroup.setLocation(newLocation);
            newGroup.setCreatedDate(new Date());
            newGroup.setUpdateDttm(new Date());
            newGroup.getChildren().add(checkSaveBlog);
            checkSaveGroupBlog = mongoOperations.insert(newGroup);
        }

        // remove object log in group old duplicate
        Query query1 = new Query();
        Query query2 = new Query();
        GroupBlog groupBlogsOld = mongoOperations.findOne(query1.addCriteria(Criteria.where("location")
                .is(checkExistBlog.getLocation())), GroupBlog.class);
        GroupBlog groupBlogNew = mongoOperations.findOne(query2.addCriteria(Criteria.where("location")
                .is(blog.getLocation())), GroupBlog.class);
        if (groupBlogNew.getChildren().size() > 0 && groupBlogsOld.getChildren().size() > 0) {
            Blog blogOld = groupBlogsOld.getChildren().stream()
                    .filter((t) -> t.getId().equals(checkExistBlog.getId())).findFirst().orElse(null);
            Blog blogNew = groupBlogNew.getChildren().stream()
                    .filter((t) -> t.getId().equals(checkBlogExist.getId())).findFirst().orElse(null);
            if (blogOld.getId().equals(blogNew.getId())) {
                if (!blogOld.getLocation().equals(blogNew.getLocation())) {
                    for (Blog elBlog : groupBlogsOld.getChildren()) {
                        if (elBlog.getId().equals(checkBlogExist.getId())) {
                            groupBlogsOld.getChildren().remove(elBlog);
                            mongoOperations.save(groupBlogsOld);
                            logger.info("Remove blog in groupBlogsOld!");
                            break;
                        }
                    }
                }
            }
        }
        return ((checkSaveBlog != null) && (checkSaveUser != null) && (checkSaveGroupBlog != null)) ? checkSaveBlog
                : null;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String delete(String blogId, Principal principal) throws Exception {
        // TODO Auto-generated method stub
        Blog blog = findById(blogId);
        User checkUserLogging = iUserService.checkUserLogging(principal);
        if (checkUserLogging.getBlogs().size() > 0) {
            for (Blog item : checkUserLogging.getBlogs()) {
                if (item.getId().equals(blog.getId())) {
                    checkUserLogging.getBlogs().remove(item);
                    mongoOperations.save(checkUserLogging);
                    break;
                }
            }
        }
        GroupBlog groupBlog = findGroupBlogByLocation(blog.getLocation());
        if (groupBlog.getChildren().size() > 0) {
            for (Blog item : groupBlog.getChildren()) {
                if (item.getId().equals(blog.getId())) {
                    groupBlog.getChildren().remove(item);
                    mongoOperations.save(groupBlog);
                    break;
                }
            }
        }
        return (mongoOperations.remove(blog) != null) ? "Delete Blog Successfully!" : "Delete Blog Failed!";
    }

    @Override
    public List<GroupBlog> getAllGroupBlog() {
        // TODO Auto-generated method stub
        List<GroupBlog> groupBlogs = mongoOperations.findAll(GroupBlog.class);
        if (groupBlogs != null) {
            for (GroupBlog eGroupBlog : groupBlogs) {
                for (Blog eBlog : eGroupBlog.getChildren()) {
                    eBlog.setLikedUsers(null);
                    eBlog.setComments(null);
                }
            }
        }
        return groupBlogs;
    }

    @Override
    public GroupBlog findGroupBlogByLocation(String location) throws Exception {
        // TODO Auto-generated method stub
        String newLocation = location.replace("%2B", "+");
        Query query = new Query();
        GroupBlog groupBlog = mongoOperations.findOne(query.addCriteria(Criteria.where("location").is(newLocation)),
                GroupBlog.class);
        if (groupBlog == null) {
            logger.info("groupBlog not found!");
            throw new Exception("groupBlog not found!");
        }
        return groupBlog;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Blog likeBlog(String blogId, String userIdOfBlog, Principal principal) throws Exception {
        // TODO Auto-generated method stub
        Blog blog = findById(blogId);
        User checkUserLogging = iUserService.checkUserLogging(principal);
        Blog checkSaveBlog = null;
        User checkSaveUser = null;
        GroupBlog checkSaveGroupBlog = null;
        boolean checkLiked = false;
        // check user liked and remove like blog in blog
        if (blog.getLikedUsers().size() > 0) {
            for (User item : blog.getLikedUsers()) {
                if (item.getId().equals(checkUserLogging.getId())) {
                    blog.getLikedUsers().remove(item);
                    checkSaveBlog = mongoOperations.save(blog);
                    checkLiked = true;
                    break;
                }
            }
        }
        if (checkLiked) {
            // remove like blog in user
            User userAreLiked = iUserService.getUserById(userIdOfBlog);
            if (userAreLiked.getBlogs().size() > 0) {
                for (Blog item : userAreLiked.getBlogs()) {
                    if (item.getId().equals(checkSaveBlog.getId())) {
                        for (User el : item.getLikedUsers()) {
                            if (el.getId().equals(checkUserLogging.getId())) {
                                item.getLikedUsers().remove(el);
                                checkSaveUser = mongoOperations.save(userAreLiked);
                                break;
                            }
                        }
                    }
                }
            }
            // remove like in group blog
            GroupBlog groupBlog = findGroupBlogByLocation(checkSaveBlog.getLocation());
            if (groupBlog.getChildren().size() > 0) {
                for (Blog item : groupBlog.getChildren()) {
                    if (item.getId().equals(checkSaveBlog.getId())) {
                        for (User el : item.getLikedUsers()) {
                            if (el.getId().equals(checkUserLogging.getId())) {
                                item.getLikedUsers().remove(el);
                                checkSaveGroupBlog = mongoOperations.save(groupBlog);
                                break;
                            }
                        }
                    }
                }
            }
        } else {
            // add like blog in blog
            if (blog.getLikedUsers() != null) {
                blog.getLikedUsers().add(checkUserLogging);
                checkSaveBlog = mongoOperations.save(blog);
            }
            // add like blog in user
            User userAreLiked = iUserService.getUserById(userIdOfBlog);
            if (userAreLiked.getBlogs().size() > 0) {
                for (Blog item : userAreLiked.getBlogs()) {
                    if (item.getId().equals(checkSaveBlog.getId())) {
                        item.getLikedUsers().add(checkUserLogging);
                        checkSaveUser = mongoOperations.save(userAreLiked);
                        break;
                    }
                }
            }
            // add like in group blog
            GroupBlog groupBlog = findGroupBlogByLocation(checkSaveBlog.getLocation());
            if (groupBlog.getChildren().size() > 0) {
                for (Blog item : groupBlog.getChildren()) {
                    if (item.getId().equals(checkSaveBlog.getId())) {
                        item.getLikedUsers().add(checkUserLogging);
                        checkSaveGroupBlog = mongoOperations.save(groupBlog);
                        break;
                    }
                }
            }
            // publish event notification
            if ((checkSaveBlog != null) && (checkSaveUser != null) && (checkSaveGroupBlog != null)) {
                // create notification
                Notification notification = new Notification();
                notification.setContent(" like your story!");
                notification.setThumbnail(checkUserLogging.getAvatar());
                notification.setPermalink(checkSaveBlog.getId());
                notification.setType(ETypeNotify.BLOG);
                notification.setFullName(checkUserLogging.getFullName());
                notification.setLastModifiedUser(checkUserLogging.getUsername());
                notification.setUpdateDttm(new Date());
                Notification checkSaveNotify = mongoOperations.insert(notification);
                // check lst notification user
                if (userAreLiked.getNotifications() != null) {
                    userAreLiked.getNotifications().add(checkSaveNotify);
                }
                mongoOperations.save(userAreLiked);
                // publish notification to socket
                ListNotificationEvent listNotificationEvent = new ListNotificationEvent(this,
                        userAreLiked.getId(),
                        notification);
                logger.info("save successfully!");
                customEventPublisher.publishCustomEvent(listNotificationEvent);
            }
        }
        // set null lst follow
        if (checkSaveBlog.getLikedUsers().size() > 0) {
            for (User user : checkSaveBlog.getLikedUsers()) {
                user.setFollowedUsers(null);
                user.setFollowingUsers(null);
                user.setPassword("");
                user.setNotifications(null);
                user.setBlogs(null);
                user.setReports(null);
            }
        }
        return checkSaveBlog;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Comment commentBlog(Comment comment, String blogId, String userIdOfBlog, Principal principal)
            throws Exception {
        // TODO Auto-generated method stub
        Blog blog = findById(blogId);
        User checkUserLogging = iUserService.checkUserLogging(principal);
        Blog checkSaveBlog = null;
        User checkSaveUser = null;
        GroupBlog checkSaveGroupBlog = null;
        comment.setUserIdComment(checkUserLogging.getId());
        comment.setUserAvt(checkUserLogging.getAvatar());
        comment.setFullName(checkUserLogging.getFullName());
        comment.setIsLocalGuide(checkUserLogging.isLocalGuide());
        Comment checkSaveComment = mongoOperations.insert(comment);
        // add comment blog in blog
        if (blog.getComments() != null) {
            blog.getComments().add(checkSaveComment);
            checkSaveBlog = mongoOperations.save(blog);
        }
        // add comment blog in user
        User userAreCommented = iUserService.getUserById(userIdOfBlog);
        if (userAreCommented.getBlogs().size() > 0) {
            for (Blog item : userAreCommented.getBlogs()) {
                if (item.getId().equals(checkSaveBlog.getId())) {
                    item.getComments().add(checkSaveComment);
                    checkSaveUser = mongoOperations.save(userAreCommented);
                    break;
                }
            }
        }
        // add like in group blog
        GroupBlog groupBlog = findGroupBlogByLocation(checkSaveBlog.getLocation());
        if (groupBlog.getChildren().size() > 0) {
            for (Blog item : groupBlog.getChildren()) {
                if (item.getId().equals(checkSaveBlog.getId())) {
                    item.getComments().add(checkSaveComment);
                    checkSaveGroupBlog = mongoOperations.save(groupBlog);
                    break;
                }
            }
        }
        // publish event notification
        if ((checkSaveBlog != null) && (checkSaveUser != null) && (checkSaveGroupBlog != null)) {
            // create notification
            Notification notification = new Notification();
            notification.setContent(" comment your post!");
            notification.setThumbnail(checkUserLogging.getAvatar());
            notification.setPermalink(checkSaveBlog.getId());
            notification.setType(ETypeNotify.BLOG);
            notification.setFullName(checkUserLogging.getFullName());
            notification.setCreateUser(checkUserLogging.getUsername());
            notification.setCreatedDate(new Date());
            notification.setLastModifiedUser(checkUserLogging.getUsername());
            notification.setUpdateDttm(new Date());
            Notification checkSaveNotify = mongoOperations.insert(notification);
            // check lst notification user
            if (userAreCommented.getNotifications() != null) {
                userAreCommented.getNotifications().add(checkSaveNotify);
            }
            mongoOperations.save(userAreCommented);
            // publish notification to socket
            ListNotificationEvent listNotificationEvent = new ListNotificationEvent(this,
                    userAreCommented.getId(),
                    checkSaveNotify);
            logger.info("save successfully!");
            customEventPublisher.publishCustomEvent(listNotificationEvent);
        }
        // set null lst follow
        if (checkSaveBlog.getLikedUsers().size() > 0) {
            for (User user : checkSaveBlog.getLikedUsers()) {
                user.setFollowedUsers(null);
                user.setFollowingUsers(null);
                user.setPassword("");
                user.setNotifications(null);
                user.setBlogs(null);
                user.setReports(null);
            }
        }
        return checkSaveComment;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String deleteComment(String commentId, String blogId, String userIdOfBlog, Principal principal)
            throws Exception {
        // TODO Auto-generated method stub
        Blog blog = findById(blogId);
        Comment comment = iCommentService.findById(commentId);
        User checkUserLogging = iUserService.checkUserLogging(principal);
        Blog checkSaveBlog = null;
        User checkSaveUser = null;
        GroupBlog checkSaveGroupBlog = null;

        boolean checkComment = false;
        // check user liked and remove like blog in blog
        if (blog.getComments().size() > 0) {
            for (Comment item : blog.getComments()) {
                if (item.getId().equals(comment.getId())) {
                    blog.getComments().remove(item);
                    checkSaveBlog = mongoOperations.save(blog);
                    checkComment = true;
                    break;
                }
            }
        }
        if (checkComment) {
            // remove like blog in user
            User userAreComment = iUserService.getUserById(userIdOfBlog);
            if (userAreComment.getBlogs().size() > 0) {
                for (Blog item : userAreComment.getBlogs()) {
                    if (item.getId().equals(checkSaveBlog.getId())) {
                        for (Comment el : item.getComments()) {
                            if (el.getId().equals(comment.getId())) {
                                item.getComments().remove(el);
                                checkSaveUser = mongoOperations.save(userAreComment);
                                break;
                            }
                        }
                    }
                }
            }
            // remove like in group blog
            GroupBlog groupBlog = findGroupBlogByLocation(checkSaveBlog.getLocation());
            if (groupBlog.getChildren().size() > 0) {
                for (Blog item : groupBlog.getChildren()) {
                    if (item.getId().equals(checkSaveBlog.getId())) {
                        for (Comment el : item.getComments()) {
                            if (el.getId().equals(comment.getId())) {
                                item.getComments().remove(el);
                                checkSaveGroupBlog = mongoOperations.save(groupBlog);
                                break;
                            }
                        }
                    }
                }
            }
        }
        return ((mongoOperations.remove(comment) != null) && (checkSaveBlog != null) && (checkSaveUser != null)
                && (checkSaveGroupBlog != null)) ? "Delete Comment Successfully!" : "Delete Comment Failed!";
    }

    @Override
    public String banBlog(String idReport, String blogId) throws Exception {
        // TODO Auto-generated method stub
        Blog checkBlogBan = findById(blogId);
        checkBlogBan.setBan(true);
        Blog saveBlog = mongoOperations.save(checkBlogBan);
        User checkSaveUser = null;
        GroupBlog checkSaveGroupBlog = null;
        List<User> users = mongoOperations.findAll(User.class);
        // check ban blog in user
        if (users != null) {
            for (User elUser : users) {
                for (Blog elBlog : elUser.getBlogs()) {
                    if (saveBlog.getId().equals(elBlog.getId())) {
                        elBlog.setBan(true);
                        checkSaveUser = mongoOperations.save(elUser);
                        break;
                    }
                }
            }
        }
        // check ban blog in group
        GroupBlog groupBlog = findGroupBlogByLocation(saveBlog.getLocation());
        if (groupBlog.getChildren().size() > 0) {
            for (Blog item : groupBlog.getChildren()) {
                if (item.getId().equals(saveBlog.getId())) {
                    item.setBan(true);
                    checkSaveGroupBlog = mongoOperations.save(groupBlog);
                    break;
                }
            }
        }
        Report getByIdReport = iReportService.getById(idReport);
        getByIdReport.setBan(true);
        mongoOperations.save(getByIdReport);
        return ((checkSaveUser != null) && (saveBlog != null) && (checkSaveGroupBlog != null))
                ? "Ban Blog successfully!"
                : "Ban Blog failed!";
    }

    @Override
    public Report reportBlog(Report report, String blogId, Principal principal) throws Exception {
        // TODO Auto-generated method stub\
        Blog checkBlogReport = findById(blogId);
        User checkUserLogging = iUserService.checkUserLogging(principal);
        report.setFullName(checkUserLogging.getFullName());
        Report reportSave = mongoOperations.insert(report);
        User checkSaveUser = null;
        Query query = new Query();
        User userOfBlog = mongoOperations
                .findOne(query.addCriteria(Criteria.where("id").is(checkBlogReport.getUserIdCreated())), User.class);

        if (userOfBlog.getBlogs().size() > 0) {
            userOfBlog.getBlogs().stream().filter(t -> t.getId().equals(checkBlogReport.getId())).findFirst()
                    .orElseThrow(() -> new Exception("Not found blog in User"));
            checkUserLogging.getReports().add(reportSave);
            checkSaveUser = mongoOperations.save(checkUserLogging);
        }
        // check report blog in group
        GroupBlog groupBlog = findGroupBlogByLocation(checkBlogReport.getLocation());
        if (groupBlog.getChildren().size() > 0) {
            groupBlog.getChildren().stream().filter(t -> t.getId().equals(checkBlogReport.getId())).findFirst()
                    .orElseThrow(() -> new Exception("Not found blog in Group"));
        }
        // publish notifications
        if (checkSaveUser != null && reportSave != null) {
            // create notification
            Notification notification = new Notification();
            notification.setContent(reportSave.getDescription());
            notification.setThumbnail(checkUserLogging.getAvatar());
            notification.setPermalink(checkBlogReport.getId());
            notification.setType(ETypeNotify.BLOG);
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
    public Integer totalBlog() {
        List<Blog> blogs = mongoOperations.findAll(Blog.class);
        return blogs.size();
    }

}
