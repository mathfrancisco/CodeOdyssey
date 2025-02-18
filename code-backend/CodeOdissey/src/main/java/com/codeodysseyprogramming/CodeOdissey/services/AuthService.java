package com.codeodysseyprogramming.CodeOdissey.services;


import com.codeodysseyprogramming.CodeOdissey.dto.request.LoginRequest;
import com.codeodysseyprogramming.CodeOdissey.dto.request.SignUpRequest;
import com.codeodysseyprogramming.CodeOdissey.dto.response.JwtAuthResponse;
import com.codeodysseyprogramming.CodeOdissey.exceptions.UnauthorizedException;
import com.codeodysseyprogramming.CodeOdissey.models.User;
import com.codeodysseyprogramming.CodeOdissey.security.JwtTokenProvider;
import org.apache.coyote.BadRequestException;
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
