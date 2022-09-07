package com.traveltogether.configservice.service;

import com.traveltogether.configservice.document.Comment;

public interface ICommentService {

    Comment save(Comment comment, String blogId) throws Exception;

    Comment findById(String commentId) throws Exception;

}
