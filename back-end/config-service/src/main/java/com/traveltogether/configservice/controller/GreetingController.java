package com.traveltogether.configservice.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/test/all")
public class GreetingController {
    
    @RequestMapping("/swagger")
    public String home() {
	    return "redirect:/swagger-ui.html";
    }

}
