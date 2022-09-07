package com.traveltogether.configservice.config.jpaAuditing;

import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class JpaAuditingConfig implements AuditorAware<String> {

   @Override
   public Optional<String> getCurrentAuditor() {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        return Optional.of(name);
   }

}
