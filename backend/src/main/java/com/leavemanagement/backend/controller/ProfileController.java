package com.leavemanagement.backend.controller;


import com.leavemanagement.backend.model.Department;
import com.leavemanagement.backend.model.User;
import com.leavemanagement.backend.repository.DepartmentRepository;
import com.leavemanagement.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin("*")
public class ProfileController {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;

    public ProfileController(UserRepository userRepository, DepartmentRepository departmentRepository) {
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
    }

    @GetMapping("/{userId}")
    public Map<String, Object> getUserProfile(@PathVariable String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> profile = new LinkedHashMap<>();
        profile.put("userId", user.getUserId());
        profile.put("name", user.getFullName());
        profile.put("email", user.getEmail());
        profile.put("mobileNumber", user.getMobileNumber());
        profile.put("joiningDate", user.getJoiningDate());
        profile.put("role", user.getRole().name());
        profile.put("department", user.getDeptId() != null ? user.getDeptId().getDeptName() : null);

        // 🌿 For Manager → show employees under their department
        if (user.getRole() == User.Role.MANAGER) {
            Department dept = user.getDeptId();
            if (dept != null) {
                List<User> employees = userRepository.findByDeptId_DeptId(dept.getDeptId())
                        .stream()
                        .filter(u -> u.getRole() == User.Role.EMPLOYEE)
                        .collect(Collectors.toList());

                List<Map<String, Object>> empList = employees.stream().map(emp -> {
                    Map<String, Object> e = new LinkedHashMap<>();
                    e.put("userId", emp.getUserId());
                    e.put("name", emp.getFullName());
                    e.put("email", emp.getEmail());
                    e.put("mobileNumber", emp.getMobileNumber());
                    e.put("joiningDate", emp.getJoiningDate());
                    return e;
                }).collect(Collectors.toList());

                profile.put("teamMembers", empList);
            }
        }

        // 🌿 For HR → show all departments with their managers
        else if (user.getRole() == User.Role.HR) {
            List<Map<String, Object>> deptInfo = departmentRepository.findAll().stream().map(d -> {
                Map<String, Object> info = new LinkedHashMap<>();
                info.put("deptId", d.getDeptId());
                info.put("deptName", d.getDeptName());
                info.put("managerId", d.getManagerId());
                return info;
            }).collect(Collectors.toList());
            profile.put("departments", deptInfo);
        }

        // 🌿 For Employee → show their manager name
        else if (user.getRole() == User.Role.EMPLOYEE) {
            Department dept = user.getDeptId();
            if (dept != null && dept.getManagerId() != null) {
                Optional<User> manager = userRepository.findByUserId(dept.getManagerId());
                manager.ifPresent(mgr -> profile.put("managerName", mgr.getFullName()));
            }
        }

        return profile;
    }
}