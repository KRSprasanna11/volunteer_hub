package com.volunteerhub.volunteerhub.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class EventFullResponseDTO {

    private Long id;
    private String title;
    private String category;
    private String description;

    private LocalDate startDate;
    private LocalDate endDate;
    private LocalTime startTime;
    private LocalTime endTime;

    private LocalDate registrationStartDate;
    private LocalTime registrationStartTime;
    private LocalDate registrationEndDate;
    private LocalTime registrationEndTime;

    private String locationName;
    private String address;
    private String city;
    private String area;
    private String mapLink;

    private int totalSlots;
    private long remainingSlots;

    private Integer minAge;
    private String genderPref;
    private String skills;

    private String organizerName;

    // ✅ REQUIRED Constructor for JPQL Query
    public EventFullResponseDTO(
            Long id,
            String title,
            String category,
            String description,
            LocalDate startDate,
            LocalDate endDate,
            LocalTime startTime,
            LocalTime endTime,

            LocalDate registrationStartDate,
            LocalTime registrationStartTime,
            LocalDate registrationEndDate,
            LocalTime registrationEndTime,

            String locationName,
            String address,
            String city,
            String area,
            String mapLink,
            int totalSlots,

            long remainingSlots,

            Integer minAge,
            String genderPref,
            String skills,
            String organizerName
    ) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.startTime = startTime;
        this.endTime = endTime;

        this.registrationStartDate = registrationStartDate;
        this.registrationStartTime = registrationStartTime;
        this.registrationEndDate = registrationEndDate;
        this.registrationEndTime = registrationEndTime;

        this.locationName = locationName;
        this.address = address;
        this.city = city;
        this.area = area;
        this.mapLink = mapLink;
        this.totalSlots = totalSlots;

        this.remainingSlots = (int) remainingSlots;

        this.minAge = minAge;
        this.genderPref = genderPref;
        this.skills = skills;
        this.organizerName = organizerName;
    }

    // ✅ Getters only (No unwanted changes)

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getCategory() {
        return category;
    }

    public String getDescription() {
        return description;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public LocalDate getRegistrationStartDate() {
        return registrationStartDate;
    }

    public LocalTime getRegistrationStartTime() {
        return registrationStartTime;
    }

    public LocalDate getRegistrationEndDate() {
        return registrationEndDate;
    }

    public LocalTime getRegistrationEndTime() {
        return registrationEndTime;
    }

    public String getLocationName() {
        return locationName;
    }

    public String getAddress() {
        return address;
    }

    public String getCity() {
        return city;
    }

    public String getArea() {
        return area;
    }

    public String getMapLink() {
        return mapLink;
    }

    public int getTotalSlots() {
        return totalSlots;
    }

    public long getRemainingSlots() {
        return remainingSlots;
    }

    public Integer getMinAge() {
        return minAge;
    }

    public String getGenderPref() {
        return genderPref;
    }

    public String getSkills() {
        return skills;
    }

    public String getOrganizerName() {
        return organizerName;
    }
}
