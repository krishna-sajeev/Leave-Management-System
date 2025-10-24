package com.leavemanagement.backend.controller;

import com.leavemanagement.backend.model.Holiday;
import com.leavemanagement.backend.model.LeaveRequest;
import com.leavemanagement.backend.repository.HolidayRepository;
import com.leavemanagement.backend.repository.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/holidays")
@CrossOrigin(origins = "http://localhost:5173")
public class HolidayController {

    @Autowired
    private HolidayRepository holidayRepository;

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @GetMapping
    public List<Holiday> getAllHolidays() {
        return holidayRepository.findAll();
    }

    @PostMapping
    public Holiday createHoliday(@RequestBody Holiday holiday) {
        return holidayRepository.save(holiday);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Holiday> updateHoliday(@PathVariable Long id, @RequestBody Holiday updatedHoliday) {
        return holidayRepository.findById(id)
                .map(existing -> {
                    existing.setHolidayName(updatedHoliday.getHolidayName());
                    existing.setDate(updatedHoliday.getDate());
                    existing.setDescription(updatedHoliday.getDescription());
                    Holiday saved = holidayRepository.save(existing);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHoliday(@PathVariable Long id) {
        if (holidayRepository.existsById(id)) {
            holidayRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/calendar")
    public List<Map<String, Object>> getLeaveCalendar(@RequestParam(defaultValue = "30") int days,
                                                      @RequestParam(required = false) String managerId) {
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusDays(days);

        List<LeaveRequest> leaves;
        if (managerId != null) {
            leaves = leaveRequestRepository.findByManagerAndDateRange(managerId, today, endDate);
        } else {
            leaves = leaveRequestRepository.findByDateRange(today, endDate);
        }

        return leaves.stream().map(l -> {
            Map<String, Object> map = new HashMap<>();
            map.put("title", l.getUser().getFullName() + " (" + l.getLeaveType() + ")");
            map.put("start", l.getStartDate().toString());
            map.put("end", l.getEndDate().toString());
            map.put("status", l.getStatus());
            return map;
        }).collect(Collectors.toList());
    }

}
