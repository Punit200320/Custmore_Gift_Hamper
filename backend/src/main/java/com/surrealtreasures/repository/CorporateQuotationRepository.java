package com.surrealtreasures.repository;

import com.surrealtreasures.entity.CorporateQuotation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CorporateQuotationRepository extends JpaRepository<CorporateQuotation, String> {

    List<CorporateQuotation> findByCompanyNameContainingIgnoreCase(String companyName);

    List<CorporateQuotation> findByStatus(String status);
}
