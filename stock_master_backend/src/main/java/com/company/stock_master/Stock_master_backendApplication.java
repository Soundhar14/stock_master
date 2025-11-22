package com.company.stock_master;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableConfigurationProperties
@EnableScheduling
public class Stock_master_backendApplication {

	public static void main(String[] args) {
		SpringApplication.run(Stock_master_backendApplication.class, args);
		System.out.println("Server running");
	}

}
