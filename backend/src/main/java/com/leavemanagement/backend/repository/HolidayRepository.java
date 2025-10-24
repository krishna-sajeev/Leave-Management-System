package com.leavemanagement.backend.repository;

import com.leavemanagement.backend.model.Holiday;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HolidayRepository extends JpaRepository<Holiday, Long> {
}
