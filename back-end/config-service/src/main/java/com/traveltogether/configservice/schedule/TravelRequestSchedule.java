package com.traveltogether.configservice.schedule;

import com.traveltogether.configservice.document.User;
import com.traveltogether.configservice.service.ITravelRequestService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Clock;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Component
@RequiredArgsConstructor
public class TravelRequestSchedule {

    private final ITravelRequestService iTravelRequestService;

//    private final Clock clock;

    private static final Logger logger = LoggerFactory.getLogger(TravelRequestSchedule.class);

    @Scheduled(fixedDelay = 86400000)
    public void scheduleTaskWithFixedRate() throws Exception {

        List<User> users = iTravelRequestService.getAllUserCreatedTravelRequest();
        for (User user :
                users) {
            if (user.getTravelRequest().isActive()) {
                if (user.getTravelRequest().getEndDate().after(new Date())) {
                    user.getTravelRequest().setActive(false);
                    logger.info("Qua ngay roi!");
                };
            }
        }
    }
}
