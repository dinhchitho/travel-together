package com.traveltogether.configservice;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.traveltogether.configservice.config.mongo.ConfigMongo;
//import com.traveltogether.configservice.config.mongo.ConfigMongo;
import com.traveltogether.configservice.document.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.context.annotation.Import;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.scheduling.annotation.EnableScheduling;
import springfox.documentation.spring.data.rest.configuration.SpringDataRestConfiguration;

import java.util.Arrays;
import java.util.List;

@Import({ ConfigMongo.class, SpringDataRestConfiguration.class })
@EnableScheduling
@SpringBootApplication
public class ConfigServiceApplication implements CommandLineRunner {

    private static Logger logger = LogManager.getLogger();

    @Autowired
    private MongoOperations mongoOperations;

    public static void main(String[] args) {
        SpringApplication.run(ConfigServiceApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {

        // System.out.println(serverProperties);
        List<Role> checkLst = mongoOperations.findAll(Role.class);
        if (checkLst.size() == 0) {
            ObjectMapper objectMapper = new ObjectMapper();
            Role[] roles = objectMapper.readValue(new ClassPathResource("init-roles.json").getFile(), Role[].class);
            Arrays.stream(roles).forEach(role -> mongoOperations.insert(role));
        }
    }
}
