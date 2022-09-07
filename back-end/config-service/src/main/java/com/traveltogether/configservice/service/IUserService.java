package com.traveltogether.configservice.service;

import java.security.Principal;
import java.util.List;

import com.traveltogether.configservice.document.Report;
import com.traveltogether.configservice.document.User;
import com.traveltogether.configservice.dto.ObjectIdentifyCardDTO;
import com.traveltogether.configservice.dto.SendSMSDto;
import com.traveltogether.configservice.dto.Total;
import com.traveltogether.configservice.payload.request.LoginExternalRequest;
import com.traveltogether.configservice.payload.request.LoginRequest;
import com.traveltogether.configservice.payload.request.SignupRequest;
import com.traveltogether.configservice.payload.response.JwtResponse;
import com.traveltogether.configservice.payload.response.MessageResponse;

public interface IUserService {
    User save(User user);

    JwtResponse authenticateUser(LoginRequest loginRequest);

    JwtResponse authenticateUserExternal(LoginExternalRequest loginRequest) throws Exception;

    User registerUser(SignupRequest signupRequest) throws Exception;

    User checkPhone(String phone) throws Exception;

    String sendOptSms(String phone) throws Exception;

    User changePassword(String userId, String newPassword) throws Exception;

    User getUserById(String userId) throws Exception;

    User becomeLocalGuilde(ObjectIdentifyCardDTO identifyCard, Principal principal) throws Exception;

    User checkUserLogging(Principal principal) throws Exception;

    User updateUser(Principal principal, User user) throws Exception;

    List<User> getAllBlackLst(Principal principal) throws Exception;

    String addBlackLst(Principal principal, String userId) throws Exception;

    String removeUserBlackLst(Principal principal, String userId) throws Exception;

    Report report(Principal principal, Report report) throws Exception;

    List<User> getAllFollowers(Principal principal) throws Exception;

    List<User> getAllFollowing(Principal principal) throws Exception;

    String addFollowing(Principal principal, String userIdFollowId) throws Exception;

    String deleteFollowing(Principal principal, String userIdFollowId) throws Exception;

    List<User> getAllUser();

    List<User> deleteUser(String userId) throws Exception;

    List<User> getAllRoleAdmin() throws Exception;

    String banAcc(String idReport, String userId) throws Exception;

    String changePasswordUser(String oldPassword, String newPassword, Principal principal) throws Exception;

    List<Report> getAllReport();

    Boolean updateNotify(String notifyId, Principal principal) throws Exception;

    Total total();
}
