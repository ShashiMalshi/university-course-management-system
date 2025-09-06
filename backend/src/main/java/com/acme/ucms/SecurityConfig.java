package com.acme.ucms;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/**", "/h2-console/**").permitAll()
                .anyRequest().permitAll()
            )
            .headers(h -> h.frameOptions(f -> f.disable())); // H2 console
        return http.build();
    }
}
