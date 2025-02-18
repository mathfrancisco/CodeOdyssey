// UserUpdateRequest.java
package com.codeodysseyprogramming.CodeOdissey.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;


@Data
public class UserUpdateRequest {
    @NotBlank
    private String name;
    private String bio;
    private String avatar;
}