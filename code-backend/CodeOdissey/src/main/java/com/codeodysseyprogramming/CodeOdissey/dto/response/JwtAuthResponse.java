// JwtAuthResponse.java
package com.codeodysseyprogramming.CodeOdissey.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JwtAuthResponse {
    private String tokenType = "Bearer";

    public JwtAuthResponse(String accessToken) {
    }

    // Getters and Setters
}