package com.leavemanagement.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "leave_types")
public class LeaveTypes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "leave_type_id")
    private Long leaveTypeId;

    @Column(name = "type_name", nullable = false, unique = true)
    private String typeName;

    @Column(name = "max_days_per_year")
    private int maxDaysPerYear;

    // Getters and Setters
    public Long getLeaveTypeId() {
        return leaveTypeId;
    }

    public void setLeaveTypeId(Long leaveTypeId) {
        this.leaveTypeId = leaveTypeId;
    }

    public String getTypeName() {
        return typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }

    public int getMaxDaysPerYear() {
        return maxDaysPerYear;
    }

    public void setMaxDaysPerYear(int maxDaysPerYear) {
        this.maxDaysPerYear = maxDaysPerYear;
    }
}
