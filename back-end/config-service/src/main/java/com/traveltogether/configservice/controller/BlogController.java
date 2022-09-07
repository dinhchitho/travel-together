package com.traveltogether.configservice.controller;

import java.security.Principal;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;

import com.traveltogether.configservice.document.Blog;
import com.traveltogether.configservice.document.Comment;
import com.traveltogether.configservice.document.GroupBlog;
import com.traveltogether.configservice.document.Report;
import com.traveltogether.configservice.document.User;
import com.traveltogether.configservice.payload.response.BaseError;
import com.traveltogether.configservice.payload.response.BaseResponse;
import com.traveltogether.configservice.service.IBlogService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/user/blog")
public class BlogController {

    @Autowired
    private IBlogService iBlogService;

    @GetMapping("/getAll")
    public ResponseEntity<BaseResponse<List<User>>> getAllBlog() {
        BaseResponse<List<User>> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(iBlogService.getAll());
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @GetMapping("/getAllByGroup")
    public ResponseEntity<BaseResponse<List<GroupBlog>>> getAllByGroup() {
        BaseResponse<List<GroupBlog>> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(iBlogService.getAllGroupBlog());
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @GetMapping("/getAllByGroupLocation")
    public ResponseEntity<BaseResponse<GroupBlog>> getAllByGroupLocation(
            @RequestParam("location") String location) {
        BaseResponse<GroupBlog> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(iBlogService.findGroupBlogByLocation(location));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @PostMapping("")
    public ResponseEntity<BaseResponse<Blog>> save(@Valid @RequestBody Blog blog, Principal principal) {
        BaseResponse<Blog> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(iBlogService.save(blog, principal));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @DeleteMapping("")
    public ResponseEntity<BaseResponse<String>> delete(@RequestParam("blogId") String blogId, Principal principal) {
        BaseResponse<String> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(iBlogService.delete(blogId, principal));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @PostMapping("/like")
    public ResponseEntity<BaseResponse<Blog>> likeBlog(@RequestParam("blogId") String blogId,
            @RequestParam("userIdOfBlog") String userIdOfBlog, Principal principal) {
        BaseResponse<Blog> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(iBlogService.likeBlog(blogId, userIdOfBlog, principal));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @PostMapping("/comment")
    public ResponseEntity<BaseResponse<Comment>> commentBlog(@RequestBody Comment comment,
            @RequestParam("blogId") String blogId,
            @RequestParam("userIdOfBlog") String userIdOfBlog, Principal principal) {
        BaseResponse<Comment> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(iBlogService.commentBlog(comment, blogId, userIdOfBlog, principal));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @DeleteMapping("/comment")
    public ResponseEntity<BaseResponse<String>> deleteCommentBlog(@RequestParam("commentId") String commentId,
            @RequestParam("blogId") String blogId,
            @RequestParam("userIdOfBlog") String userIdOfBlog, Principal principal) {
        BaseResponse<String> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(iBlogService.deleteComment(commentId, blogId, userIdOfBlog, principal));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @PutMapping("")
    public ResponseEntity<BaseResponse<Blog>> updateBlog(@Valid @RequestBody Blog blog, Principal principal) {
        BaseResponse<Blog> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(iBlogService.update(blog, principal));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @GetMapping("/getById")
    public ResponseEntity<BaseResponse<Blog>> findBlog(@RequestParam("blogId") String blogId) {
        BaseResponse<Blog> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(iBlogService.findById(blogId));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

    @PostMapping("/report-blog")
    public ResponseEntity<BaseResponse<Report>> reportBlog(@Valid @RequestBody Report report,
            @RequestParam("blogId") String blogId, Principal principal) {
        BaseResponse<Report> response = new BaseResponse<>();
        response.setSuccess(false);
        HttpStatus status = null;

        try {
            response.setData(iBlogService.reportBlog(report, blogId, principal));
            response.setSuccess(true);
        } catch (Exception exception) {
            response.addError(new BaseError(HttpStatus.EXPECTATION_FAILED.toString(), exception.getMessage()));
            status = HttpStatus.EXPECTATION_FAILED;
        }

        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.status(status).body(response);
    }

}
