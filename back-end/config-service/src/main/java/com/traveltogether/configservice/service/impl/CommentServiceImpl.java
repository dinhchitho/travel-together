package com.traveltogether.configservice.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.traveltogether.configservice.document.Blog;
import com.traveltogether.configservice.document.Comment;
import com.traveltogether.configservice.service.IBlogService;
import com.traveltogether.configservice.service.ICommentService;

@Service
public class CommentServiceImpl implements ICommentService {

    private static final Logger logger = LoggerFactory.getLogger(BlogServiceImpl.class);

    @Autowired
    private MongoOperations mongoOperations;

    @Autowired
    private IBlogService iBlogService;

    @Override
    public Comment save(Comment comment, String blogId) throws Exception {
        // TODO Auto-generated method stub
        Comment checkSave = mongoOperations.save(comment);
        Blog blog = iBlogService.findById(blogId);
        if (blog.getComments() != null) {
            blog.getComments().add(checkSave);
            mongoOperations.save(blog);
        }
        return checkSave;
    }

    @Override
    public Comment findById(String commentId) throws Exception {
        // TODO Auto-generated method stub
        Query query = new Query();
        Comment comment = mongoOperations.findOne(query.addCriteria(Criteria.where("id").is(commentId)), Comment.class);
        if (comment == null) {
            logger.info("comment not found!");
            throw new Exception("comment not found!");
        }
        return comment;
    }

}
