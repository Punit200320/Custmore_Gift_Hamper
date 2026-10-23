package com.surrealtreasures.repository;

import com.surrealtreasures.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {

    List<Product> findByActiveTrue();

    @Query("SELECT p FROM Product p WHERE p.active = true AND p.stockQuantity > 0")
    List<Product> findActiveAndInStock();

    List<Product> findByCategoryIgnoreCase(String category);
}
