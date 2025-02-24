package com.codeodysseyprogramming.CodeOdissey.config;

import com.codeodysseyprogramming.CodeOdissey.models.*;
import com.codeodysseyprogramming.CodeOdissey.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Configuration
public class DevDataInitializer {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initDevData() {
        return args -> {
            // Verificar se já existem dados
            if (userRepository.count() == 0) {
                System.out.println("Initializing development data...");

                // Criar usuário admin
                User adminUser = new User();
                adminUser.setEmail("admin@codeodyssey.com");
                adminUser.setPasswordHash(passwordEncoder.encode("admin123"));
                adminUser.setName("Admin User");
                adminUser.setRole(Role.ADMIN);

                User.Profile adminProfile = new User.Profile();
                adminProfile.setAvatar("https://api.dicebear.com/6.x/identicon/svg?seed=admin");
                adminProfile.setBio("CodeOdyssey System Administrator");
                adminUser.setProfile(adminProfile);

                adminUser = userRepository.save(adminUser);

                // Criar usuário instructor
                User instructorUser = new User();
                instructorUser.setEmail("instructor@codeodyssey.com");
                instructorUser.setPasswordHash(passwordEncoder.encode("instructor123"));
                instructorUser.setName("Demo Instructor");
                instructorUser.setRole(Role.INSTRUCTOR);

                User.Profile instructorProfile = new User.Profile();
                instructorProfile.setAvatar("https://api.dicebear.com/6.x/identicon/svg?seed=instructor");
                instructorProfile.setBio("Experienced Java and Spring instructor");
                instructorUser.setProfile(instructorProfile);

                instructorUser = userRepository.save(instructorUser);

                // Criar usuário estudante
                User studentUser = new User();
                studentUser.setEmail("student@codeodyssey.com");
                studentUser.setPasswordHash(passwordEncoder.encode("student123"));
                studentUser.setName("Demo Student");
                studentUser.setRole(Role.STUDENT);

                User.Profile studentProfile = new User.Profile();
                studentProfile.setAvatar("https://api.dicebear.com/6.x/identicon/svg?seed=student");
                studentProfile.setBio("Learning to code with CodeOdyssey");
                studentUser.setProfile(studentProfile);

                studentUser = userRepository.save(studentUser);

                // Criar exercícios
                Exercise exercise1 = new Exercise();
                exercise1.setTitle("Hello World em Java");
                exercise1.setDescription("Crie um programa que imprima 'Hello, World!' no console.");
                exercise1.setDifficulty(Exercise.Difficulty.EASY);
                exercise1.setLanguage("java");
                exercise1.setStarterCode("public class HelloWorld {\n    public static void main(String[] args) {\n        // Seu código aqui\n    }\n}");
                exercise1.setTestCases(List.of(
                        new Exercise.TestCase()
                ));
                exercise1.setSolution("public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}");
                exercise1.setHints(Arrays.asList("Use System.out.println() para imprimir no console", "Cuidado com a pontuação e capitalização"));
                exercise1.setPointsValue(10);

                Exercise exercise2 = new Exercise();
                exercise2.setTitle("Calculadora Simples");
                exercise2.setDescription("Crie uma calculadora que realiza as quatro operações básicas.");
                exercise2.setDifficulty(Exercise.Difficulty.MEDIUM);
                exercise2.setLanguage("java");
                exercise2.setStarterCode("public class Calculadora {\n    public static int somar(int a, int b) {\n        // Implementar\n        return 0;\n    }\n    \n    public static int subtrair(int a, int b) {\n        // Implementar\n        return 0;\n    }\n    \n    public static int multiplicar(int a, int b) {\n        // Implementar\n        return 0;\n    }\n    \n    public static double dividir(int a, int b) {\n        // Implementar\n        return 0;\n    }\n}");
                // Create test cases using no-args constructor and setters
                List<Exercise.TestCase> testCases = new ArrayList<>();

                Exercise.TestCase testCase1 = new Exercise.TestCase();
                testCase1.setInput("somar(5, 3)");
                testCase1.setExpectedOutput("8");
                testCase1.setVisible(true);

                Exercise.TestCase testCase2 = new Exercise.TestCase();
                testCase2.setInput("subtrair(10, 4)");
                testCase2.setExpectedOutput("6");
                testCase2.setVisible(true);

                Exercise.TestCase testCase3 = new Exercise.TestCase();
                testCase3.setInput("multiplicar(3, 7)");
                testCase3.setExpectedOutput("21");
                testCase3.setVisible(true);

                Exercise.TestCase testCase4 = new Exercise.TestCase();
                testCase4.setInput("dividir(10, 2)");
                testCase4.setExpectedOutput("5.0");
                testCase4.setVisible(true);

                testCases.add(testCase1);
                testCases.add(testCase2);
                testCases.add(testCase3);
                testCases.add(testCase4);

                exercise2.setTestCases(testCases);
                exercise2.setSolution("public class Calculadora {\n    public static int somar(int a, int b) {\n        return a + b;\n    }\n    \n    public static int subtrair(int a, int b) {\n        return a - b;\n    }\n    \n    public static int multiplicar(int a, int b) {\n        return a * b;\n    }\n    \n    public static double dividir(int a, int b) {\n        if (b == 0) throw new ArithmeticException(\"Divisão por zero\");\n        return (double) a / b;\n    }\n}");
                exercise2.setHints(Arrays.asList("Use os operadores básicos: +, -, *, /", "Lembre-se de validar divisão por zero"));
                exercise2.setPointsValue(20);

                exercise2.setSolution("public class Calculadora {\n    public static int somar(int a, int b) {\n        return a + b;\n    }\n    \n    public static int subtrair(int a, int b) {\n        return a - b;\n    }\n    \n    public static int multiplicar(int a, int b) {\n        return a * b;\n    }\n    \n    public static double dividir(int a, int b) {\n        if (b == 0) throw new ArithmeticException(\"Divisão por zero\");\n        return (double) a / b;\n    }\n}");
                exercise2.setHints(Arrays.asList("Use os operadores básicos: +, -, *, /", "Lembre-se de validar divisão por zero"));
                exercise2.setPointsValue(20);

                Exercise exercise1Saved = exerciseRepository.save(exercise1);
                Exercise exercise2Saved = exerciseRepository.save(exercise2);

                // Criar cursos
                Course javaCourse = new Course();
                javaCourse.setTitle("Fundamentos de Java");
                javaCourse.setDescription("Um curso completo para iniciantes em Java, abordando desde conceitos básicos até programação orientada a objetos.");
                javaCourse.setLevel(Course.Level.BEGINNER);
                javaCourse.setTechnologies(Arrays.asList("Java", "OOP"));
                javaCourse.setInstructorId(instructorUser.getId());

                List<Course.Module> modules = new ArrayList<>();

                Course.Module module1 = new Course.Module();
                module1.setTitle("Introdução ao Java");

                List<Course.Lesson> lessons1 = new ArrayList<>();

                Course.Lesson lesson1 = new Course.Lesson();
                lesson1.setTitle("O que é Java?");
                lesson1.setContent("Java é uma linguagem de programação de alto nível, orientada a objetos e independente de plataforma, criada pela Sun Microsystems no início dos anos 90 e posteriormente adquirida pela Oracle. A linguagem foi projetada para ter o menor número possível de dependências de implementação, seguindo o princípio \"Write Once, Run Anywhere\" (Escreva uma vez, execute em qualquer lugar).");
                lesson1.setVideoUrl("https://www.youtube.com/embed/example1");
                lesson1.setDuration(15);
                lesson1.setExerciseIds(Arrays.asList(exercise1Saved.getId()));

                Course.Lesson lesson2 = new Course.Lesson();
                lesson2.setTitle("Configurando o Ambiente de Desenvolvimento");
                lesson2.setContent("Para começar a programar em Java, você precisa configurar seu ambiente de desenvolvimento. Isso inclui a instalação do JDK (Java Development Kit) e opcionalmente uma IDE como Eclipse, IntelliJ IDEA ou Visual Studio Code com extensões Java.");
                lesson2.setVideoUrl("https://www.youtube.com/embed/example2");
                lesson2.setDuration(20);

                lessons1.add(lesson1);
                lessons1.add(lesson2);
                module1.setLessons(lessons1);

                Course.Module module2 = new Course.Module();
                module2.setTitle("Conceitos Básicos");

                List<Course.Lesson> lessons2 = new ArrayList<>();

                Course.Lesson lesson3 = new Course.Lesson();
                lesson3.setTitle("Variáveis e Tipos de Dados");
                lesson3.setContent("Em Java, todas as variáveis devem ser declaradas antes de serem usadas. Java é uma linguagem fortemente tipada, o que significa que cada variável deve ter um tipo específico que determina o tamanho e o layout da memória da variável, os valores que podem ser armazenados e as operações que podem ser aplicadas.");
                lesson3.setVideoUrl("https://www.youtube.com/embed/example3");
                lesson3.setDuration(25);

                Course.Lesson lesson4 = new Course.Lesson();
                lesson4.setTitle("Operadores e Expressões");
                lesson4.setContent("Java fornece vários tipos de operadores que podem ser usados para realizar operações em variáveis e valores: aritméticos, relacionais, lógicos, de atribuição, entre outros.");
                lesson4.setVideoUrl("https://www.youtube.com/embed/example4");
                lesson4.setDuration(20);
                lesson4.setExerciseIds(Arrays.asList(exercise2Saved.getId()));

                lessons2.add(lesson3);
                lessons2.add(lesson4);
                module2.setLessons(lessons2);

                modules.add(module1);
                modules.add(module2);

                javaCourse.setModules(modules);
                javaCourse.setEnrolledCount(1);
                javaCourse.setRating(4.5);
                javaCourse.setCreatedAt(LocalDateTime.now());
                javaCourse.setUpdatedAt(LocalDateTime.now());

                courseRepository.save(javaCourse);

                // Segundo curso
                Course webCourse = new Course();
                webCourse.setTitle("Desenvolvimento Web Moderno");
                webCourse.setDescription("Aprenda a criar aplicações web modernas utilizando HTML5, CSS3 e JavaScript.");
                webCourse.setLevel(Course.Level.INTERMEDIATE);
                webCourse.setTechnologies(Arrays.asList("HTML", "CSS", "JavaScript", "React"));
                webCourse.setInstructorId(instructorUser.getId());

                List<Course.Module> webModules = new ArrayList<>();

                Course.Module webModule1 = new Course.Module();
                webModule1.setTitle("HTML5 e CSS3");

                List<Course.Lesson> webLessons1 = new ArrayList<>();

                Course.Lesson webLesson1 = new Course.Lesson();
                webLesson1.setTitle("Estrutura HTML Moderna");
                webLesson1.setContent("HTML5 introduz elementos semânticos que melhoram a estrutura e acessibilidade das páginas web.");
                webLesson1.setVideoUrl("https://www.youtube.com/embed/webexample1");
                webLesson1.setDuration(30);

                webLessons1.add(webLesson1);
                webModule1.setLessons(webLessons1);
                webModules.add(webModule1);

                webCourse.setModules(webModules);
                webCourse.setEnrolledCount(0);
                webCourse.setRating(0.0);
                webCourse.setCreatedAt(LocalDateTime.now());
                webCourse.setUpdatedAt(LocalDateTime.now());

                courseRepository.save(webCourse);

                System.out.println("Development data initialized successfully!");
            }
        };
    }
}