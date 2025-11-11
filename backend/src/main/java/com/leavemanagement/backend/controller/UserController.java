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
import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository repo;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private JwtUtil jwtUtil;

    private Department department;

    private final Map<String, String> otpStore = new HashMap<>();

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User input) {
        try {
            // 🔹 Prevent duplicate email registration
            if (repo.existsByEmail(input.getEmail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("status", "error", "message", "Email already registered"));
            }

            // 🔹 Validate Department
            Department department = departmentRepository.findByDeptId(input.getDeptId().getDeptId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));

            // 🔹 Default password handling
            String defaultPassword = (input.getPassword() == null || input.getPassword().isBlank())
                    ? "Secret@123"
                    : input.getPassword();

            // 🔹 Hash + salt password
            String salt = SaltUtil.generateSalt(16);
            String hashedPassword = PasswordUtil.hashWithSHA256(defaultPassword, salt);

            input.setSalt(salt);
            input.setPassword(hashedPassword);
            input.setDeptId(department);

            // 🔹 Save to DB
            User saved = repo.save(input);
            saved.setUserId("EMP" + (saved.getId() + 10));
            repo.save(saved);

            if (saved.getRole() == User.Role.MANAGER) {
                department.setManagerId(saved.getUserId());
                departmentRepository.save(department);
            }
            // 🔹 Send email
            try {
                sendUserCreationMail(saved.getEmail(), saved.getFullName(), saved.getUserId());
            } catch (Exception mailEx) {
                mailEx.printStackTrace();
                System.err.println("Warning: Email sending failed for " + saved.getEmail());
            }

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "User created and email sent successfully",
                    "user", saved));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                    "status", "error",
                    "message", "User creation failed",
                    "error", e.getMessage()
            ));
        }
    }

    // ✅ Private helper method to send mail
    private void sendUserCreationMail(String to, String fullName, String userId) {
        String subject = "Welcome to Leave Management System 🎉";
        String body = String.format(
                "Hi %s,\n\n" +
                        "Your user account has been successfully created.\n\n" +
                        "🆔 User ID: %s\n" +
                        "📧 Login Email: %s\n" +
                        "🔑 Temporary Password: Secret@123\n\n" +
                        "Please change your password after logging in for the first time.\n\n" +
                        "Regards,\nLeave Management HR Team",
                fullName, userId, to
        );

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
        System.out.println("✅ Mail sent successfully to " + to);
    }



    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = repo.findAll();
        return ResponseEntity.ok(users);
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        return repo.findById(id)
                .map(existing -> {
                    existing.setFullName(updatedUser.getFullName());
                    existing.setEmail(updatedUser.getEmail());
                    existing.setMobileNumber(updatedUser.getMobileNumber());
                    existing.setRole(updatedUser.getRole());
                    existing.setJoiningDate(updatedUser.getJoiningDate());

                    if (updatedUser.getDeptId() != null) {
                        Department dept = departmentRepository.findByDeptId(updatedUser.getDeptId().getDeptId())
                                .orElseThrow(() -> new RuntimeException("Department not found"));
                        existing.setDeptId(dept);
                    }

                    repo.save(existing);
                    return ResponseEntity.ok(Map.of("status", "success", "user", existing));
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("status", "error", "message", "User not found")));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", "error", "message", "User not found"));
        }
        repo.deleteById(id);
        return ResponseEntity.ok(Map.of("status", "success", "message", "User deleted successfully"));
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User input) {
        try {
            if (input.getEmail() == null || input.getPassword() == null) {
                return ResponseEntity.badRequest().body(
                        Map.of("status", "error", "message", "Missing login fields"));
            }

            Optional<User> userOpt = repo.findByEmail(input.getEmail());
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(401).body(Map.of("status", "error", "message", "Invalid credentials"));
            }

            User user = userOpt.get();
            String enteredHashed = PasswordUtil.hashWithSHA256(input.getPassword(), user.getSalt());
            if (!enteredHashed.equals(user.getPassword())) {
                return ResponseEntity.status(401).body(Map.of("status", "error", "message", "Invalid credentials"));
            }

            String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("token", token);
            response.put("user", Map.of(
                    "userId", user.getUserId(),
                    "fullName", user.getFullName(),
                    "email", user.getEmail(),
                    "role", user.getRole().name()
            ));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                    "status", "error", "message", "Login failed", "error", e.getMessage()));
        }
    }


    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        Optional<User> user = repo.findByEmail(email);
        if (user.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email not registered"));
        }

        String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
        otpStore.put(email, otp);

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(email);
        msg.setSubject("Your OTP Code");
        msg.setText("Your OTP is: " + otp);
        mailSender.send(msg);

        return ResponseEntity.ok(Map.of("message", "OTP sent successfully"));
    }

    //  RESET PASSWORD
    @PostMapping("/forgot-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        String otp = req.get("otp");
        String newPassword = req.get("newPassword");

        if (!otpStore.containsKey(email) || !otpStore.get(email).equals(otp)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid OTP"));
        }

        User user = repo.findByEmail(email).orElseThrow();
        String salt = SaltUtil.generateSalt(16);
        String hashed = PasswordUtil.hashWithSHA256(newPassword, salt);
        user.setSalt(salt);
        user.setPassword(hashed);
        repo.save(user);

        otpStore.remove(email);
        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }

    //  ROLE COUNT ENDPOINTS
    @GetMapping("/employee/count")
    public Long getEmployeeCount() {
        return repo.findByRole(User.Role.EMPLOYEE).stream().count();
    }

    @GetMapping("/manager/count")
    public Long getManagerCount() {
        return repo.findByRole(User.Role.MANAGER).stream().count();
    }
}
