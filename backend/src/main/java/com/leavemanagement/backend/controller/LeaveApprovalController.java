package com.leavemanagement.backend.controller;

import com.leavemanagement.backend.model.LeaveApproval;
import com.leavemanagement.backend.service.LeaveApprovalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/leave-approvals")
@CrossOrigin(origins = "http://localhost:5173")
public class LeaveApprovalController {

    @Autowired
    private LeaveApprovalService leaveApprovalService;

    // ✅ 1. Approve or Reject Leave
    @PostMapping("/{leaveRequestId}/action")
    public ResponseEntity<LeaveApproval> takeActionOnLeave(
            @PathVariable Long leaveRequestId,
            @RequestParam String approverId,
            @RequestParam String action // "APPROVED" or "REJECTED"
    ) {
        LeaveApproval approval = leaveApprovalService.approveLeave(leaveRequestId, approverId, action);
        return ResponseEntity.ok(approval);
    }

    // ✅ 2. Get all approvals
    @GetMapping
    public ResponseEntity<List<LeaveApproval>> getAllApprovals() {
        return ResponseEntity.ok(leaveApprovalService.getAllApprovals());
    }

    // ✅ 3. Get approval by ID
    @GetMapping("/{id}")
    public ResponseEntity<LeaveApproval> getApprovalById(@PathVariable Long id) {
        Optional<LeaveApproval> approval = leaveApprovalService.getApprovalById(id);
        return approval.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
