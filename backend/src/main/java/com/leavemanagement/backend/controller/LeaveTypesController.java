package com.leavemanagement.backend.controller;

import com.leavemanagement.backend.model.LeaveTypes;
import com.leavemanagement.backend.repository.LeaveTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api")
public class LeaveTypesController {

    @Autowired
    private LeaveTypeRepository repo;

    // ➕ Add a new leave type
    @PostMapping("/addleave-types")
    public ResponseEntity<?> createLeaveType(@RequestBody LeaveTypes leaveType) {
        try {
            // Prevent duplicate type names
            if (repo.existsByTypeName(leaveType.getTypeName())) {
                return ResponseEntity.badRequest().body("Leave type already exists");
            }

            LeaveTypes savedType = repo.save(leaveType);
            return ResponseEntity.ok(savedType);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error saving leave type");
        }
    }


    @GetMapping("/leave-types")
    public ResponseEntity<List<LeaveTypes>> getAllLeaveTypes() {
        List<LeaveTypes> leaveTypes = repo.findAll();
        return ResponseEntity.ok(leaveTypes);
    }


    @PutMapping("/leave-types/{id}")
    public ResponseEntity<?> updateLeaveType(@PathVariable Long id, @RequestBody LeaveTypes updatedLeaveType) {
        Optional<LeaveTypes> existing = repo.findById(id);

        if (existing.isEmpty()) {
            return ResponseEntity.badRequest().body("Leave type not found with ID: " + id);
        }

        LeaveTypes leaveType = existing.get();
        leaveType.setTypeName(updatedLeaveType.getTypeName());
        leaveType.setMaxDaysPerYear(updatedLeaveType.getMaxDaysPerYear());

        repo.save(leaveType);
        return ResponseEntity.ok("Leave type updated successfully");
    }


    @DeleteMapping("/leave-types/{id}")
    public ResponseEntity<?> deleteLeaveType(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.badRequest().body("Leave type not found");
        }
        repo.deleteById(id);
        return ResponseEntity.ok("Leave type deleted successfully");
    }
}
