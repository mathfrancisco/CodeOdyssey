// JwtAuthResponse.java
package com.codeodysseyprogramming.CodeOdissey.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JwtAuthResponse {
    private String tokenType = "Bearer";
    private String accessToken;
    private String id;
    private String email;
    private String role;

    public JwtAuthResponse(String accessToken, String id, String email, String role) {
        this.accessToken = accessToken;
        this.id = id;
        this.email = email;
        this.role = role;
    }
}