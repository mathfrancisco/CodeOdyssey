package com.codeodysseyprogramming.CodeOdissey.models;

public enum Role {
    STUDENT,
    ADMIN,
    INSTRUCTOR;

    public String toUpperCase() {
        return this.toString().toUpperCase();
    }
}
