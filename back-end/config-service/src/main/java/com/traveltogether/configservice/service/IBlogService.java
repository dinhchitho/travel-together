package com.traveltogether.configservice.service;

import java.security.Principal;
import java.util.List;

import com.traveltogether.configservice.document.Blog;
import com.traveltogether.configservice.document.Comment;
import com.traveltogether.configservice.document.GroupBlog;
import com.traveltogether.configservice.document.Report;
import com.traveltogether.configservice.document.User;

public interface IBlogService {

    Blog findById(String id) throws Exception;

    List<User> getAll();

    Blog save(Blog blog, Principal principal) throws Exception;

    Blog update(Blog blog, Principal principal) throws Exception;

    String delete(String id, Principal principal) throws Exception;

    List<GroupBlog> getAllGroupBlog();

    GroupBlog findGroupBlogByLocation(String location) throws Exception;

    Blog likeBlog(String blogId, String userIdOfBlog, Principal principal) throws Exception;

    Comment commentBlog(Comment comment, String blogId, String userIdOfBlog, Principal principal) throws Exception;

    String deleteComment(String commentId, String blogId, String userIdOfBlog, Principal principal) throws Exception;

    String banBlog(String idReport, String blogId) throws Exception;

    Report reportBlog(Report report, String blogId, Principal principal) throws Exception;

    Integer totalBlog();
}
