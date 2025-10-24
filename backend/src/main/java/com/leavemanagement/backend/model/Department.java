package com.leavemanagement.backend.model;

import jakarta.persistence.*;

@Entity
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "dept_id", nullable = false, unique = true)
    private String deptId;

    private String deptName;

    private String managerId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDeptId() {
        return deptId;
    }

    public void setDeptId(String deptId) {
        this.deptId = deptId;
    }

    public String getDeptName() {
        return deptName;
    }

    public void setDeptName(String deptName) {
        this.deptName = deptName;
    }

    public String getManagerId() {
        return managerId;
    }

    public void setManagerId(String managerId) {
        this.managerId = managerId;
    }

    public Department(Long id, String deptId, String deptName, String managerId) {
        this.id = id;
        this.deptId = deptId;
        this.deptName = deptName;
        this.managerId = managerId;
    }

    public Department() {
    }
}
