package com.traveltogether.configservice.repository;

import com.traveltogether.configservice.document.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserDetailRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);

    Optional<User> findByPhone(String phone);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
}
