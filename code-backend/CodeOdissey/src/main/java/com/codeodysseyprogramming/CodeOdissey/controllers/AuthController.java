package com.codeodisseyprogramming.controllers;

import com.codeodisseyprogramming.dtos.requests.LoginRequest;
import com.codeodisseyprogramming.dtos.requests.SignUpRequest;
import com.codeodisseyprogramming.dtos.responses.JwtAuthResponse;
import com.codeodisseyprogramming.models.User;
import com.codeodisseyprogramming.security.JwtTokenProvider;
import com.codeodisseyprogramming.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider tokenProvider;

     @PostMapping("/login")
    public ResponseEntity<JwtAuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getEmail(),
                loginRequest.getPassword()
            )
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        User user = userService.getUserByEmail(loginRequest.getEmail());
        
        return ResponseEntity.ok(new JwtAuthResponse(jwt, user.getId(), user.getRole().name()));
    }

    @PostMapping("/signup")
    public ResponseEntity<JwtAuthResponse> signup(@Valid @RequestBody SignUpRequest signUpRequest) {
        if (userService.existsByEmail(signUpRequest.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        User user = userService.createUser(signUpRequest);
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                signUpRequest.getEmail(),
                signUpRequest.getPassword()
            )
        );
        
        String jwt = tokenProvider.generateToken(authentication);
        return ResponseEntity.ok(new JwtAuthResponse(jwt, user.getId(), user.getRole().name()));
    }
}

