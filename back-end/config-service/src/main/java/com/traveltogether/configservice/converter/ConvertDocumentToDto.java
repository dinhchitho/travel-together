package com.traveltogether.configservice.converter;

import com.traveltogether.configservice.document.User;
import com.traveltogether.configservice.dto.UserDTO;

public class ConvertDocumentToDto {
    public UserDTO mapDocumentToDto(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());
        userDTO.setPassword(user.getPassword());
        userDTO.setFullName(user.getFullName());
        userDTO.setGender(user.isGender());
        userDTO.setDob(user.getDob());
        userDTO.setPhone(user.getPhone());
        userDTO.setAvatar(user.getAvatar());
        userDTO.setCoverPhoto(user.getCoverPhoto());
        userDTO.setCountry(user.getCountry());
        userDTO.setCountryIcon(user.getCountryIcon());
        userDTO.setBio(user.getBio());
        userDTO.setWeight(user.getWeight());
        userDTO.setHeight(user.getHeight());
        userDTO.setMarried(user.isMarried());
        userDTO.setBlackListedUsers(user.getBlackListedUsers());
        userDTO.setBlogs(user.getBlogs());
        userDTO.setReports(user.getReports());
        userDTO.setDisable(user.isDisable());
        userDTO.setInterests(user.getInterests());
        userDTO.setNotifications(user.getNotifications());
        userDTO.setHasSubmitID(user.isHasSubmitID());
        userDTO.setOrigin_place(user.getOrigin_place());
        userDTO.setResidence_place(user.getResidence_place());
        userDTO.setIssued_date(user.getIssued_date());
        userDTO.setIdentify_card_id(user.getIdentify_card_id());
        userDTO.setFollowingUsers(user.getFollowingUsers());
        userDTO.setFollowedUsers(user.getFollowedUsers());
        userDTO.setTravelRequest(user.getTravelRequest());
        userDTO.setAddress_entities(user.getAddress_entities());
        userDTO.setLocalGuide(user.isLocalGuide());
        userDTO.setHasUpdated(user.isHasUpdated());
        return userDTO;

    }
}
