package com.leavemanagement.backend.repository;

import com.leavemanagement.backend.model.LeaveBalance;
import com.leavemanagement.backend.model.LeaveTypes;
import com.leavemanagement.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LeaveBalanceRepo extends JpaRepository<LeaveBalance,Long> {
   // List<LeaveBalance> findByUser(User user);

    Optional<LeaveBalance> findByUserAndLeaveType(User user, LeaveTypes leaveType);



    List<LeaveBalance> findByUser_UserId(String userId);
}
