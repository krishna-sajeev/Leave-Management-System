package com.leavemanagement.backend.service;

import com.leavemanagement.backend.model.LeaveApproval;
import com.leavemanagement.backend.model.LeaveApproval.Action;
import com.leavemanagement.backend.model.LeaveRequest;
import com.leavemanagement.backend.model.User;
import com.leavemanagement.backend.repository.LeaveApprovalRepository;
import com.leavemanagement.backend.repository.LeaveRequestRepository;
import com.leavemanagement.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class LeaveApprovalService {

    @Autowired
    private LeaveApprovalRepository leaveApprovalRepository;

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private UserRepository userRepository;

    public LeaveApproval approveLeave(Long leaveRequestId, String approverId, String action) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(leaveRequestId)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));

        User approver = userRepository.findByUserId(approverId)
                .orElseThrow(() -> new RuntimeException("Approver not found"));

        Action approvalAction = Action.valueOf(action.toUpperCase());

        LeaveApproval approval = new LeaveApproval();
        approval.setLeaveRequest(leaveRequest);
        approval.setApprover(approver);
        approval.setAction(approvalAction);
        approval.setActionDate(new Date());

        // Update LeaveRequest status
        leaveRequest.setStatus(approvalAction == Action.APPROVED ?
                LeaveRequest.Status.APPROVED : LeaveRequest.Status.REJECTED);
        leaveRequestRepository.save(leaveRequest);

        return leaveApprovalRepository.save(approval);
    }

    public List<LeaveApproval> getAllApprovals() {
        return leaveApprovalRepository.findAll();
    }

    public Optional<LeaveApproval> getApprovalById(Long id) {
        return leaveApprovalRepository.findById(id);
    }
}
