// UserProfileResponse.java
package com.codeodysseyprogramming.CodeOdissey.dto.response;

import lombok.Data;

@Data
public class UserProfileResponse {
    private String id;
    private String email;
    private String name;
    private String role;
    private String avatar;
    private String bio;
}