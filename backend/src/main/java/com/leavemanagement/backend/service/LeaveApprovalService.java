package com.leavemanagement.backend.service;

import com.leavemanagement.backend.model.*;
import com.leavemanagement.backend.model.LeaveApproval.Action;
import com.leavemanagement.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
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

    @Autowired
    private LeaveBalanceRepo leaveBalanceRepository;

    @Autowired
    private LeaveTypeRepository leaveTypesRepository;



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

        if (approvalAction == Action.APPROVED) {
            leaveRequest.setStatus(LeaveRequest.Status.APPROVED);

            //  Update leave balance
            updateLeaveBalance(leaveRequest);
        } else {
            leaveRequest.setStatus(LeaveRequest.Status.REJECTED);
        }

        leaveRequestRepository.save(leaveRequest);
        return leaveApprovalRepository.save(approval);
    }

    private void updateLeaveBalance(LeaveRequest leaveRequest) {
        User user = leaveRequest.getUser();
        LeaveTypes leaveType = leaveRequest.getLeaveType();


        long daysTaken = ChronoUnit.DAYS.between(
                leaveRequest.getStartDate(),
                leaveRequest.getEndDate()
        ) + 1;

        Optional<LeaveBalance> optionalBalance =
                leaveBalanceRepository.findByUserAndLeaveType(user, leaveType);

        LeaveBalance balance = optionalBalance.orElseGet(() -> {
            LeaveBalance newBalance = new LeaveBalance();
            newBalance.setUser(user);
            newBalance.setLeaveType(leaveType);
            newBalance.setBalanceDays(12);
            return newBalance;
        });

        int newBalanceDays = balance.getBalanceDays() - (int) daysTaken;

        if (newBalanceDays < 0) {

            throw new RuntimeException("Insufficient leave balance for user: " + user.getFullName());
        }

        balance.setBalanceDays(newBalanceDays);
        leaveBalanceRepository.save(balance);
    }


    public List<LeaveApproval> getAllApprovals() {
        return leaveApprovalRepository.findAll();
    }

    public Optional<LeaveApproval> getApprovalById(Long id) {
        return leaveApprovalRepository.findById(id);
    }
}
