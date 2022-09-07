//package com.traveltogether.configservice.config.security;
//
//import org.springframework.context.annotation.Configuration;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//import com.traveltogether.configservice.constanst.Constant;
//
//@Configuration
//public class CorsConfiguration {
//
//    @Bean
//    public WebMvcConfigurer corsConfigurer() {
//        return new WebMvcConfigurer() {
//            @Override
//            public void addCorsMappings(CorsRegistry registry) {
//                registry.addMapping("/**")
//                        .allowedMethods(Constant.GET, Constant.POST, Constant.PUT, Constant.DELETE)
//                        .allowedHeaders("*")
//                        .allowedOriginPatterns("*")
//                        .allowCredentials(true);
//            }
//        };
//    }
//
//}
