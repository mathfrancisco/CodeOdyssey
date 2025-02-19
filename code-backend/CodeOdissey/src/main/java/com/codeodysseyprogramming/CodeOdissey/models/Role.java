package com.codeodysseyprogramming.CodeOdissey.models;

public enum Role {
    STUDENT,
    ADMIN,
    MODERATOR;

    public String toUpperCase() {
        return this.toString().toUpperCase();
    }
}
