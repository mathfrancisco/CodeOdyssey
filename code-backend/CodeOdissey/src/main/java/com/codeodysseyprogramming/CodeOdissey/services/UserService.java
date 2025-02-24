package com.codeodysseyprogramming.CodeOdissey.services;

import com.codeodysseyprogramming.CodeOdissey.dto.request.SignUpRequest;
import com.codeodysseyprogramming.CodeOdissey.dto.request.UserUpdateRequest;
import com.codeodysseyprogramming.CodeOdissey.exceptions.ResourceNotFoundException;
import com.codeodysseyprogramming.CodeOdissey.exceptions.UnauthorizedException;
import com.codeodysseyprogramming.CodeOdissey.models.Role;
import com.codeodysseyprogramming.CodeOdissey.models.User;
import com.codeodysseyprogramming.CodeOdissey.repositories.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Busca um usuário pelo ID
     * @param id ID do usuário
     * @return Objeto do usuário
     * @throws ResourceNotFoundException se o usuário não for encontrado
     */
    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    /**
     * Busca um usuário pelo email
     * @param email Email do usuário
     * @return Objeto do usuário
     * @throws ResourceNotFoundException se o usuário não for encontrado
     */
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    /**
     * Verifica se existe um usuário com o email fornecido
     * @param email Email a ser verificado
     * @return true se existir, false caso contrário
     */
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * Cria um novo usuário a partir dos dados de cadastro
     * @param signUpRequest Dados do cadastro
     * @return Usuário criado
     */
    @Transactional
    public User createUser(@Valid SignUpRequest signUpRequest) {
        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setPasswordHash(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setName(signUpRequest.getName());
        user.setRole(Role.STUDENT);
        user.setCreatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    /**
     * Atualiza os dados de um usuário
     * @param email Email do usuário (identificador)
     * @param updateRequest Dados a serem atualizados
     * @return Usuário atualizado
     */
    @Transactional
    public User updateUser(String email, UserUpdateRequest updateRequest) {
        User user = getUserByEmail(email);

        // Atualiza os campos básicos do usuário
        if (updateRequest.getName() != null) {
            user.setName(updateRequest.getName());
        }

        // Garante que o perfil existe antes de atualizá-lo
        if (user.getProfile() == null) {
            user.setProfile(new User.Profile());
        }

        // Atualiza os campos do perfil apenas se forem fornecidos
        if (updateRequest.getBio() != null) {
            user.getProfile().setBio(updateRequest.getBio());
        }

        if (updateRequest.getAvatar() != null) {
            user.getProfile().setAvatar(updateRequest.getAvatar());
        }

        // Salva as alterações
        return userRepository.save(user);
    }

    /**
     * Atualiza a senha de um usuário
     * @param email Email do usuário
     * @param oldPassword Senha atual
     * @param newPassword Nova senha
     * @return Usuário atualizado
     * @throws UnauthorizedException se a senha atual for inválida
     */
    @Transactional
    public User updatePassword(String email, String oldPassword, String newPassword) {
        User user = getUserByEmail(email);

        // Verifica se a senha atual está correta
        if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid old password");
        }

        // Atualiza a senha
        user.setPasswordHash(passwordEncoder.encode(newPassword));

        // Registra o momento da última atualização
        user.setLastLogin(LocalDateTime.now());

        return userRepository.save(user);
    }

    /**
     * Lista todos os usuários (apenas para administradores)
     * @return Lista de usuários
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Atualiza a função (role) de um usuário (apenas para administradores)
     * @param userId ID do usuário
     * @param newRole Nova função
     * @return Usuário atualizado
     */
    @Transactional
    public User updateUserRole(String userId, Role newRole) {
        User user = getUserById(userId);
        user.setRole(newRole);
        return userRepository.save(user);
    }
}