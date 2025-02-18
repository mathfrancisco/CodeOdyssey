// UserUpdateRequest.java
package com.codeodysseyprogramming.CodeOdissey.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
@Data
public class UserUpdateRequest {
    // Getters e Setters
    private String name;
    private String bio;
    private String avatar;

}