package com.traveltogether.configservice.repository.impl;

import com.traveltogether.configservice.config.security.jwt.JwtUtils;
import com.traveltogether.configservice.document.User;
import com.traveltogether.configservice.repository.IUserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepositoryImpl implements IUserRepository {

    @Autowired
    private MongoOperations mongoOperations;


    @Override
    public User save(User user) {
        return mongoOperations.insert(user);
    }


}
