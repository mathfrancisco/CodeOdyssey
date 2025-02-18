package com.codeodisseyprogramming.services;

import com.codeodisseyprogramming.dtos.requests.LoginRequest;
import com.codeodisseyprogramming.dtos.requests.SignUpRequest;
import com.codeodisseyprogramming.dtos.responses.JwtAuthResponse;
import com.codeodisseyprogramming.exceptions.BadRequestException;
import com.codeodisseyprogramming.exceptions.UnauthorizedException;
import com.codeodisseyprogramming.models.User;
import com.codeodisseyprogramming.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public JwtAuthResponse login(LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
                )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);
            
            User user = userService.getUserByEmail(loginRequest.getEmail());
            
            return new JwtAuthResponse(
                jwt,
                user.getId(),
                user.getEmail(),
                user.getRole().name()
            );
        } catch (Exception e) {
            throw new UnauthorizedException("Invalid email or password");
        }
    }

    @Transactional
    public JwtAuthResponse signup(SignUpRequest signUpRequest) {
        // Validate if user already exists
        if (userService.existsByEmail(signUpRequest.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        // Create new user
        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setPasswordHash(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setName(signUpRequest.getName());
        user.setRole(User.Role.STUDENT); // Default role for new signups

        user = userService.createUser(user);

        // Authenticate the new user
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                signUpRequest.getEmail(),
                signUpRequest.getPassword()
            )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        return new JwtAuthResponse(
            jwt,
            user.getId(),
            user.getEmail(),
            user.getRole().name()
        );
    }

    public void logout() {
        SecurityContextHolder.clearContext();
    }

    public boolean validateToken(String token) {
        return tokenProvider.validateToken(token);
    }

    public String getUserEmailFromToken(String token) {
        return tokenProvider.getUserEmailFromToken(token);
    }
}
