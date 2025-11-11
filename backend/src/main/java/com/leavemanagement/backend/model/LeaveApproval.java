package com.leavemanagement.backend.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "leave_approval")
public class LeaveApproval {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "approval_id")
    private Long approvalId;

    @ManyToOne
    @JoinColumn(name = "leave_request_id", referencedColumnName = "leave_request_id")
    private LeaveRequest leaveRequest;

    @ManyToOne
    @JoinColumn(name = "approver_id", referencedColumnName = "user_id")
    private User approver;

    @Enumerated(EnumType.STRING)
    private Action action;


    @Column(name = "action_date")
    private Date actionDate;

    public enum Action { APPROVED, REJECTED }
    // Getters and Setters
    public Long getApprovalId() { return approvalId; }
    public void setApprovalId(Long approvalId) { this.approvalId = approvalId; }

    public LeaveRequest getLeaveRequest() { return leaveRequest; }
    public void setLeaveRequest(LeaveRequest leaveRequest) { this.leaveRequest = leaveRequest; }

    public User getApprover() { return approver; }
    public void setApprover(User approver) { this.approver = approver; }

    public Action getAction() {
        return action;
    }

    public void setAction(Action action) {
        this.action = action;
    }

    public LeaveApproval() {
    }

    public LeaveApproval(Long approvalId, LeaveRequest leaveRequest, User approver, Action action, Date actionDate) {
        this.approvalId = approvalId;
        this.leaveRequest = leaveRequest;
        this.approver = approver;
        this.action = action;
        this.actionDate = actionDate;
    }

    public Date getActionDate() { return actionDate; }
    public void setActionDate(Date actionDate) { this.actionDate = actionDate; }
}
