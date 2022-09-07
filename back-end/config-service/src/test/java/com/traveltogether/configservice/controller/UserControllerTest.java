package com.traveltogether.configservice.controller;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@ExtendWith({SpringExtension.class})
@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mvc;

    @Test
    void getUserById() {
    }

    @Test
    void getAllUser() throws Exception {
        RequestBuilder request = MockMvcRequestBuilders.get("/getAll-users");
        MvcResult result = mvc.perform(request).andReturn();
        assertEquals("Hello world", result.getResponse().getContentAsString());
    }
}