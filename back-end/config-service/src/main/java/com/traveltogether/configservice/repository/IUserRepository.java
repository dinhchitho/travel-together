package com.traveltogether.configservice.repository;

import com.traveltogether.configservice.document.User;

public interface IUserRepository {
    User save(User user);

}
