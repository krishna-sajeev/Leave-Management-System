package com.leavemanagement.backend.controller;

import com.leavemanagement.backend.model.Department;
import com.leavemanagement.backend.model.User;
import com.leavemanagement.backend.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "http://localhost:5173")// allow frontend access
public class DepartmentController {

    @Autowired
    private DepartmentRepository departmentRepository;

    //  1. Create new Department
    @PostMapping
    public ResponseEntity<Department> createDepartment(@RequestBody Department department) {
        Department savedDepartment = departmentRepository.save(department);
        return ResponseEntity.ok(savedDepartment);
    }

    // ✅ 2. Get all Departments
    @GetMapping("/dept")
    public ResponseEntity<List<Department>> getAllDepartments() {
        List<Department> departments = departmentRepository.findAll();
        return ResponseEntity.ok(departments);
    }
    @GetMapping("/count")
    public Long getAllManager() {
        return departmentRepository.findAll()
                .stream()
                .count();
    }
    // ✅ 3. Get Department by ID
    @GetMapping("/{deptId}")
    public ResponseEntity<Department> getDepartmentById(@PathVariable String deptId) {
        Optional<Department> department = departmentRepository.findByDeptId(deptId);
        return department.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
