package com.terralink.model;

public enum CategoryType {
    TRANSIT("Transit", "Light rail, electric bus & bikeshare"),
    DIET("Diet", "Plant-based & organic local meals"),
    HOME("Home Energy", "Line-drying & grid peak cuts"),
    CONSUMPTION("Circular Goods", "Repair cafes & refill pantries");

    private final String displayName;
    private final String description;

    CategoryType(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }
}
