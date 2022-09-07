package com.traveltogether.configservice.config.security.service.impl;

import com.traveltogether.configservice.document.User;
import com.traveltogether.configservice.repository.UserDetailRepository;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    UserDetailRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent() && !user.get().isDisable()) {
            return UserDetailsImpl.build(user.get());
        } else {
            throw new UsernameNotFoundException("User Not Found with username: " + username);
        }
        // .orElseThrow(() -> new UsernameNotFoundException("User Not Found with
        // username: " + username));

    }
}
