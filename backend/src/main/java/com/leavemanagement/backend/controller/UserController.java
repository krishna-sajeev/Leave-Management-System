package com.leavemanagement.backend.controller;

import com.leavemanagement.backend.model.Department;
import com.leavemanagement.backend.model.User;
import com.leavemanagement.backend.repository.DepartmentRepository;
import com.leavemanagement.backend.repository.UserRepository;
import com.leavemanagement.backend.util.JwtUtil;
import com.leavemanagement.backend.util.PasswordUtil;
import com.leavemanagement.backend.util.SaltUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    UserRepository repo;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private DepartmentRepository departmentRepository;


    private final Map<String, String> otpStore = new HashMap<>();


    @PostMapping("/add")
    public ResponseEntity<?> register(@RequestBody User inputMap) {
        try {
            String email = inputMap.getEmail();
            String password = inputMap.getPassword();
            Department deptId = inputMap.getDeptId();
            String fullName = inputMap.getFullName();
            User.Role role = inputMap.getRole();
            String mobileNumber = inputMap.getMobileNumber();
            LocalDate joiningDate = inputMap.getJoiningDate();


            if (email == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of("status", "Missing required fields"));
            }

            if (repo.existsByEmail(email)) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("status", "User already registered with this email"));
            }

            Department department = departmentRepository.findByDeptId(deptId.getDeptId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));

            User user = new User();
            user.setEmail(email);
            user.setPassword(password);
            user.setFullName(fullName);
            user.setDeptId(department);
            user.setJoiningDate(joiningDate);
            user.setMobileNumber(mobileNumber);
            user.setRole(role);


            String salt = SaltUtil.generateSalt(16);
            String hashed = PasswordUtil.hashWithSHA256(password, salt);
            user.setSalt(salt);
            user.setPassword(hashed);

            User saved = repo.save(user);
            saved.setUserId("EMP" + (saved.getId() + 10));
            repo.save(saved);

            return ResponseEntity.ok(Map.of("status", "success", "user", saved));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                    "status", "Registration failed",
                    "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User input) {
        try {
            if (input.getEmail() == null || input.getPassword() == null) {
                return ResponseEntity.badRequest().body(
                        Map.of("status", "error", "message", "Missing login fields")
                );
            }

            Optional<User> userOpt = repo.findByEmail(input.getEmail());
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(401).body(
                        Map.of("status", "error", "message", "Invalid credentials")
                );
            }

            User userFromDb = userOpt.get();
            String enteredHashed = PasswordUtil.hashWithSHA256(input.getPassword(), userFromDb.getSalt());
            if (!enteredHashed.equals(userFromDb.getPassword())) {
                return ResponseEntity.status(401).body(
                        Map.of("status", "error", "message", "Invalid credentials")
                );

            }

            String token = jwtUtil.generateToken(userFromDb.getEmail(), userFromDb.getRole());
            if (token == null) {
                return ResponseEntity.status(500).body(
                        Map.of("status", "error", "message", "Token generation failed")
                );
            }

            // ✅ Success response
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("token", token);
            response.put("user", Map.of(
                    "userId", userFromDb.getUserId(),
                    "fullName", userFromDb.getFullName(),
                    "email", userFromDb.getEmail(),
                    "role", userFromDb.getRole().name() // ensure it's string
            ));


            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(
                    Map.of("status", "error", "message", "Login failed", "error", e.getMessage())
            );
        }
    }
    @DeleteMapping("/delete/{id}")
    public String deleteUser(@PathVariable Long id) {
        repo.deleteById(id);
        return "User deleted successfully with ID: " + id;
    }
    @PutMapping("/edit/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        return repo.findById(id)
                .map(existingUser -> {
                    existingUser.setFullName(updatedUser.getFullName());
                    existingUser.setEmail(updatedUser.getEmail());
                    existingUser.setDeptId(updatedUser.getDeptId());
                    existingUser.setRole(updatedUser.getRole());

                    return repo.save(existingUser);
                })
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
    }
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        Optional<User> user = repo.findByEmail(email);
        if (user.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email not registered"));
        }

        // Generate OTP
        String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
        otpStore.put(email, otp);

        // Send mail
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(email);
        msg.setSubject("Your OTP Code");
        msg.setText("Your OTP is: " + otp);
        mailSender.send(msg);

        return ResponseEntity.ok(Map.of("message", "OTP sent to email"));
    }
    @PostMapping("/forgot-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        String otp = req.get("otp");
        String newPassword = req.get("newPassword");

        if (!otpStore.containsKey(email) || !otpStore.get(email).equals(otp)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid OTP"));
        }

        User user = repo.findByEmail(email).orElseThrow();
        user.setPassword(newPassword);
        String salt = SaltUtil.generateSalt(16);
        String hashed = PasswordUtil.hashWithSHA256(newPassword, salt);
        user.setSalt(salt);
        user.setPassword(hashed);
        repo.save(user);

        otpStore.remove(email);
        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }


    @GetMapping("/employee/count")
    public Long getAllEmployee() {
        return repo.findByRole(User.Role.EMPLOYEE)
                .stream()
                .count();
    }

    @GetMapping("/manager/count")
    public Long getAllManager() {
        return repo.findByRole(User.Role.MANAGER)
                .stream()
                .count();
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = repo.findAll();
        return ResponseEntity.ok(users);
    }





}
