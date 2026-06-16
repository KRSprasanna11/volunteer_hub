package com.volunteerhub.volunteerhub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@SpringBootApplication
@EnableScheduling   // ✅ REQUIRED FOR REMINDER SCHEDULER
public class VolunteerhubApplication {

	public static void main(String[] args) {
		SpringApplication.run(VolunteerhubApplication.class, args);
	}
}

/* =========================================
   SERVE UPLOADED FILES FROM /uploads/**
========================================= */
@Configuration
class FileUploadConfig implements WebMvcConfigurer {

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {

		String uploadDir = "uploads";
		File uploadPath = new File(uploadDir);

		String absolutePath = uploadPath.getAbsolutePath();

		registry.addResourceHandler("/uploads/**")
				.addResourceLocations("file:" + absolutePath + "/");
	}
}
