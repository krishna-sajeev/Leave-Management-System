package com.leavemanagement.backend.repository;

import com.leavemanagement.backend.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department,Integer> {
    Optional<Department> findByDeptId(String deptId);
}
