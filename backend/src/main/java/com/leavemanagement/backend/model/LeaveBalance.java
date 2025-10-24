package com.leavemanagement.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "leave_balance")
public class LeaveBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "balance_id")
    private Long balanceId;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "leave_type_id", referencedColumnName = "leave_type_id")
    private LeaveTypes leaveType;

    @Column(name = "balance_days")
    private int balanceDays;

    // Getters and Setters
    public Long getBalanceId() { return balanceId; }
    public void setBalanceId(Long balanceId) { this.balanceId = balanceId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public LeaveTypes getLeaveType() { return leaveType; }
    public void setLeaveType(LeaveTypes leaveType) { this.leaveType = leaveType; }

    public int getBalanceDays() { return balanceDays; }
    public void setBalanceDays(int balanceDays) { this.balanceDays = balanceDays; }
}
