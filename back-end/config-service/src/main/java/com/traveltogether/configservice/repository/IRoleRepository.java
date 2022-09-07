package com.traveltogether.configservice.repository;

import com.traveltogether.configservice.document.Role;
import com.traveltogether.configservice.model.ERole;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface IRoleRepository extends MongoRepository<Role, String> {
    Optional<Role> findByName(ERole name);
}
