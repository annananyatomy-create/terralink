package com.terralink.model;

public class UserProfile {
    private String name;
    private String handle;
    private String neighborhood;
    private int level;
    private String levelTitle;
    private int xp;
    private int nextLevelXp;
    private int streakDays;
    private double totalSavedKg;
    private double totalEmittedKg;
    private double dailyBudgetCappedKg; // 5.0 kg Paris Agreement target
    private double todayEmittedKg;
    private double todaySavedKg;

    public UserProfile(String name, String handle, String neighborhood) {
        this.name = name;
        this.handle = handle;
        this.neighborhood = neighborhood;
        this.level = 4;
        this.levelTitle = "Canopy Guardian";
        this.xp = 1480;
        this.nextLevelXp = 2000;
        this.streakDays = 9;
        this.totalSavedKg = 84.6;
        this.totalEmittedKg = 28.2;
        this.dailyBudgetCappedKg = 5.0;
        this.todayEmittedKg = 1.8;
        this.todaySavedKg = 4.4;
    }

    public void addActivity(double emitted, double saved, int earnedXp) {
        this.todayEmittedKg += emitted;
        this.todaySavedKg += saved;
        this.totalSavedKg += saved;
        this.totalEmittedKg += emitted;
        this.xp += earnedXp;

        if (this.xp >= this.nextLevelXp) {
            this.level++;
            this.nextLevelXp += 800;
            this.levelTitle = "Level " + this.level + " Biome Ambassador";
        }
    }

    public String getName() { return name; }
    public String getHandle() { return handle; }
    public String getNeighborhood() { return neighborhood; }
    public int getLevel() { return level; }
    public String getLevelTitle() { return levelTitle; }
    public int getXp() { return xp; }
    public int getNextLevelXp() { return nextLevelXp; }
    public int getStreakDays() { return streakDays; }
    public double getTotalSavedKg() { return totalSavedKg; }
    public double getTotalEmittedKg() { return totalEmittedKg; }
    public double getDailyBudgetCappedKg() { return dailyBudgetCappedKg; }
    public double getTodayEmittedKg() { return todayEmittedKg; }
    public double getTodaySavedKg() { return todaySavedKg; }
}
