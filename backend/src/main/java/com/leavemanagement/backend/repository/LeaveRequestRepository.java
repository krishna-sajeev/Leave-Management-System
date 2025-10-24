package com.leavemanagement.backend.repository;

import com.leavemanagement.backend.model.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest,Long> {


    List<LeaveRequest> findByUserUserId(String id);


    List<LeaveRequest> findByApproverId(String managerId);

    @Query("SELECT l FROM LeaveRequest l WHERE l.status = 'APPROVED' AND l.startDate BETWEEN :start AND :end")
    List<LeaveRequest> findByDateRange(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT l FROM LeaveRequest l WHERE l.status = 'APPROVED' AND l.approverId = :approverId AND l.startDate BETWEEN :start AND :end")
    List<LeaveRequest> findByManagerAndDateRange(@Param("approverId") String managerId,
                                                 @Param("start") LocalDate start,
                                                 @Param("end") LocalDate end);
}

