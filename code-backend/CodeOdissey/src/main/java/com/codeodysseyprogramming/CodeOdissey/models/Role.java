package com.codeodysseyprogramming.CodeOdissey.models;

import lombok.Getter;
import lombok.Setter;

public class Role {
    @Getter
    @Setter
    public static String USER = "STUDENT";
    @Getter
    @Setter
    public static String ADMIN = "ADMIN";
    @Getter
    @Setter
    public static  String MODERATOR = "MODERATOR";

}
