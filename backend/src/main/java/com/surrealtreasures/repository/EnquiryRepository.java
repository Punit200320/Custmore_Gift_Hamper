package com.surrealtreasures.repository;

import com.surrealtreasures.entity.Enquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnquiryRepository extends JpaRepository<Enquiry, String> {
    List<Enquiry> findAllByOrderByCreatedAtDesc();
    List<Enquiry> findByStatusOrderByCreatedAtDesc(String status);
}
