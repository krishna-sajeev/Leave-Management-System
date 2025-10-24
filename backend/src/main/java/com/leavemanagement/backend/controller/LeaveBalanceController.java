package com.leavemanagement.backend.controller;

import com.leavemanagement.backend.model.LeaveBalance;
import com.leavemanagement.backend.model.User;
import com.leavemanagement.backend.repository.LeaveBalanceRepo;
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

    // ✅ 1. Add Leave Balance
    @PostMapping
    public ResponseEntity<LeaveBalance> addLeaveBalance(@RequestBody LeaveBalance leaveBalance) {
        LeaveBalance savedBalance = leaveBalanceRepository.save(leaveBalance);
        return ResponseEntity.ok(savedBalance);
    }

    // ✅ 2. Get All Leave Balances
    @GetMapping
    public ResponseEntity<List<LeaveBalance>> getAllLeaveBalances() {
        List<LeaveBalance> balances = leaveBalanceRepository.findAll();
        return ResponseEntity.ok(balances);
    }

    // ✅ 3. Get Leave Balance by ID
    @GetMapping("/{id}")
    public ResponseEntity<LeaveBalance> getLeaveBalanceById(@PathVariable Long id) {
        Optional<LeaveBalance> balance = leaveBalanceRepository.findById(id);
        return balance.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ 4. Get Leave Balances by User ID (useful for employee dashboard)

        @GetMapping("/user/{userId}")
        public ResponseEntity<Map<String, Integer>> getLeaveBalancesByUser(@PathVariable String userId) {
            List<LeaveBalance> userBalances = leaveBalanceRepository.findByUser_UserId(userId);
            Map<String, Integer> leaveTypeToBalance = userBalances.stream()
                    .collect(Collectors.toMap(
                            lb -> lb.getLeaveType().getTypeName(),
                            LeaveBalance::getBalanceDays
                    ));
            // Define all possible leave types
            List<String> allLeaveTypes = List.of("Earned", "Casual", "Sick");

// If any type missing, add with default value = 12
            allLeaveTypes.forEach(type ->
                    leaveTypeToBalance.putIfAbsent(type, 12)
            );

            return ResponseEntity.ok(leaveTypeToBalance);
        }

    }
