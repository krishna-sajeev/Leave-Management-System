package com.leavemanagement.backend.controller;

import com.leavemanagement.backend.model.Department;
import com.leavemanagement.backend.model.LeaveRequest;
import com.leavemanagement.backend.model.LeaveTypes;
import com.leavemanagement.backend.model.User;
import com.leavemanagement.backend.repository.DepartmentRepository;
import com.leavemanagement.backend.repository.LeaveRequestRepository;
import com.leavemanagement.backend.repository.LeaveTypeRepository;
import com.leavemanagement.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/leave-requests")
@CrossOrigin(origins = "http://localhost:5173")
public class LeaveRequestController {

    @Autowired
    private DepartmentRepository departmentRepository ;

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    public LeaveTypeRepository leaveTypeRepository;

    // ✅ 1. Create a new Leave Request
    @PostMapping("/apply")
    public ResponseEntity<LeaveRequest> createLeaveRequest(@RequestBody LeaveRequest leaveRequest) {
        String userId = leaveRequest.getUser().getUserId();
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long leaveTypeId = leaveRequest.getLeaveType().getLeaveTypeId();
        LeaveTypes leaveType = leaveTypeRepository.findById(leaveTypeId)
                .orElseThrow(() -> new RuntimeException("Leave type not found"));

        // Set the persistent entities
        leaveRequest.setUser(user);
        leaveRequest.setLeaveType(leaveType);
        String managerId =   departmentRepository.findByDeptId(user.getDeptId().getDeptId())
                .map(Department::getManagerId)
                .orElse(null);
        leaveRequest.setApproverId(managerId);

        leaveRequest.setAppliedOn(new Date());
        leaveRequest.setStatus(LeaveRequest.Status.PENDING);
        LeaveRequest savedRequest = leaveRequestRepository.save(leaveRequest);
        return ResponseEntity.ok(savedRequest);
    }

    // ✅ 2. Get all Leave Requests
    @GetMapping("/all")
    public ResponseEntity<List<LeaveRequest>> getAllLeaveRequests() {
        List<LeaveRequest> leaveRequests = leaveRequestRepository.findAll();
        return ResponseEntity.ok(leaveRequests);
    }

    // ✅ 3. Get Leave Request by ID
    @GetMapping("/{id}")
    public ResponseEntity<LeaveRequest> getLeaveRequestById(@PathVariable Long id) {
        Optional<LeaveRequest> leaveRequest = leaveRequestRepository.findById(id);
        return leaveRequest.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<List<LeaveRequest>> getLeaveRequestByUserId(@PathVariable String id) {
        List<LeaveRequest> leaveRequest = leaveRequestRepository.findByUserUserId(id);
        return ResponseEntity.ok(leaveRequest);
    }

    @GetMapping("/manager/{managerId}")
    public ResponseEntity<List<LeaveRequest>> getLeavePendingRequest(@PathVariable String managerId){
        List<LeaveRequest> leaveRequests = leaveRequestRepository.findByApproverId(managerId);
        return ResponseEntity.ok(leaveRequests);
    }
}
