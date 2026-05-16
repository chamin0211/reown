package com.reown;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class ReownApplication {

	public static void main(String[] args) {
		SpringApplication.run(ReownApplication.class, args);
	}
}