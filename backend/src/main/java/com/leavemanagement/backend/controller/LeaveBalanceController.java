package com.leavemanagement.backend.controller;

import com.leavemanagement.backend.model.LeaveBalance;
import com.leavemanagement.backend.model.LeaveTypes;
import com.leavemanagement.backend.model.User;
import com.leavemanagement.backend.repository.LeaveBalanceRepo;
import com.leavemanagement.backend.repository.LeaveTypeRepository;
import com.leavemanagement.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/leave-balance")
@CrossOrigin(origins = "http://localhost:5173")
public class LeaveBalanceController {

    @Autowired
    private LeaveBalanceRepo leaveBalanceRepository;


    @Autowired
    private LeaveTypeRepository leaveTypeRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Integer>> getLeaveBalancesByUser(@PathVariable String userId) {
        // Fetch all leave balances for a given user (with leave type joined)
        Optional<User> user = userRepository.findByUserId(userId);
        List<LeaveBalance> userBalances = leaveBalanceRepository.findByUserId(user.get().getId());

        // Convert to Map<LeaveTypeName, BalanceDays>
        Map<String, Integer> leaveTypeToBalance = userBalances.stream()
                .filter(lb -> lb.getLeaveType() != null)
                .collect(Collectors.toMap(
                        lb -> lb.getLeaveType().getTypeName(),
                        LeaveBalance::getBalanceDays,
                        (existing, replacement) -> existing // handle duplicate types gracefully
                ));

        // 🟢 Fetch all available leave types from DB (instead of hardcoding)
        List<LeaveTypes> allLeaveTypes = leaveTypeRepository.findAll();

        // Ensure all leave types are present in the map, even if missing for the user
        allLeaveTypes.forEach(type ->
                leaveTypeToBalance.putIfAbsent(type.getTypeName(), 12)
        );

        return ResponseEntity.ok(leaveTypeToBalance);
    }

}
