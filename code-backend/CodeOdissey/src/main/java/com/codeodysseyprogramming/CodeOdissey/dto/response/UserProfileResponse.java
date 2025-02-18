// UserProfileResponse.java
package com.codeodysseyprogramming.CodeOdissey.dto.response;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class UserProfileResponse {
    private String id;
    private String email;
    private String name;
    private String role;
    private String avatar;
    private String bio;
}