package com.leavemanagement.backend.repository;

import com.leavemanagement.backend.model.LeaveTypes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeaveTypeRepository extends JpaRepository<LeaveTypes, Long> {
    boolean existsByTypeName(String typeName);
}
