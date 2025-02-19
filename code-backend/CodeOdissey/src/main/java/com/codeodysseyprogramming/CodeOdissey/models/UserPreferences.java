package com.codeodysseyprogramming.CodeOdissey.models;

import lombok.Builder;

import java.util.List;

public record UserPreferences(
        String preferredLanguage,
        List<String> interestedTechnologies,
        Course.Level preferredDifficulty,
        boolean emailNotifications,
        Theme theme,
        int exercisesPerDay
) {
    public enum Theme {
        LIGHT,
        DARK,
        SYSTEM
    }

    public static UserPreferences getDefault() {
        return new UserPreferences(
                "Java",
                List.of(),
                Course.Level.BEGINNER,
                true,
                Theme.SYSTEM,
                3
        );
    }
}