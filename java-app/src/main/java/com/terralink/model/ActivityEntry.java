package com.terralink.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class ActivityEntry {
    private String id;
    private CategoryType category;
    private String title;
    private String description;
    private String timestamp;
    private double emittedKg;
    private double baselineKg;
    private double savedKg;
    private int xpEarned;
    private String mode;
    private Double distanceKm;

    public ActivityEntry(String id, CategoryType category, String title, String description,
                         double emittedKg, double baselineKg, double savedKg, int xpEarned,
                         String mode, Double distanceKm) {
        this.id = id;
        this.category = category;
        this.title = title;
        this.description = description;
        this.timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMM dd, HH:mm"));
        this.emittedKg = emittedKg;
        this.baselineKg = baselineKg;
        this.savedKg = savedKg;
        this.xpEarned = xpEarned;
        this.mode = mode;
        this.distanceKm = distanceKm;
    }

    public String getId() { return id; }
    public CategoryType getCategory() { return category; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getTimestamp() { return timestamp; }
    public double getEmittedKg() { return emittedKg; }
    public double getBaselineKg() { return baselineKg; }
    public double getSavedKg() { return savedKg; }
    public int getXpEarned() { return xpEarned; }
    public String getMode() { return mode; }
    public Double getDistanceKm() { return distanceKm; }
}
