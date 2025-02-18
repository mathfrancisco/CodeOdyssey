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
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getEmail(),
                loginRequest.getPassword()
            )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        
        return ResponseEntity.ok(new JwtAuthResponse(jwt));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignUpRequest signUpRequest) {
        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setPasswordHash(signUpRequest.getPassword());
        user.setRole(User.Role.STUDENT);
        
        userService.createUser(user);
        
        return ResponseEntity.ok("User registered successfully");
    }
}
