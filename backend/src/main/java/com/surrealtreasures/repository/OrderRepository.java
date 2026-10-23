package com.surrealtreasures.repository;

import com.surrealtreasures.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA Repository for Order entity.
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

    Optional<Order> findByOrderReference(String orderReference);

    List<Order> findByCustomerEmailIgnoreCase(String customerEmail);

    List<Order> findByQuotationId(String quotationId);

    List<Order> findByStatus(String status);
}
