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

    /**
     * Autentica um usuário e gera um token JWT
     */
    @Transactional
    public JwtAuthResponse login(LoginRequest loginRequest) {
        try {
            // Autentica o usuário
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            // Define a autenticação no contexto de segurança
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Gera o token JWT
            String jwt = tokenProvider.generateToken(authentication);

            // Busca informações do usuário
            User user = userService.getUserByEmail(loginRequest.getEmail());

            // Retorna a resposta com o token e informações do usuário
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

    /**
     * Cadastra um novo usuário e retorna um token JWT
     */
    @Transactional
    public JwtAuthResponse signup(SignUpRequest signUpRequest) throws BadRequestException {
        // Verifica se o usuário já existe
        if (userService.existsByEmail(signUpRequest.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        // Cria o novo usuário
        User user = userService.createUser(signUpRequest);

        // Autentica o novo usuário
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        signUpRequest.getEmail(),
                        signUpRequest.getPassword()
                )
        );

        // Define a autenticação no contexto de segurança
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Gera o token JWT
        String jwt = tokenProvider.generateToken(authentication);

        // Retorna a resposta com o token e informações do usuário
        return new JwtAuthResponse(
                jwt,
                user.getId(),
                user.getEmail(),
                user.getRole().name()
        );
    }

    /**
     * Encerra a sessão do usuário
     */
    public void logout() {
        SecurityContextHolder.clearContext();
    }

    /**
     * Valida um token JWT
     */
    public boolean validateToken(String token) {
        return tokenProvider.validateToken(token);
    }

    /**
     * Extrai o email do usuário a partir do token JWT
     * Este método agora retorna o usuário do repositório a partir do ID extraído do token
     */
    public String getUserEmailFromToken(String token) {
        // Obtém o ID do usuário do token
        String userId = tokenProvider.getUserIdFromToken(token);

        // Busca o usuário pelo ID e retorna o email
        User user = userService.getUserById(userId);
        return user.getEmail();
    }
}