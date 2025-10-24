package com.leavemanagement.backend.repository;

import com.leavemanagement.backend.model.LeaveApproval;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaveApprovalRepository extends JpaRepository<LeaveApproval,Long> {
}
