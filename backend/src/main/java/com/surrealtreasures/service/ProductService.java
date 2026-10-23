package com.surrealtreasures.service;

import com.surrealtreasures.dto.ProductTransparencyDTO;
import com.surrealtreasures.entity.Product;
import com.surrealtreasures.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllActiveProducts() {
        return productRepository.findByActiveTrue();
    }

    public List<Product> getAllActiveAndInStockProducts() {
        return productRepository.findActiveAndInStock();
    }

    public Optional<Product> getProductById(String id) {
        return productRepository.findById(id);
    }

    public List<ProductTransparencyDTO> getAllProductTransparency() {
        return productRepository.findAll().stream()
                .map(ProductTransparencyDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ProductTransparencyDTO> getProductTransparencyByCategory(String category) {
        return productRepository.findByCategoryIgnoreCase(category).stream()
                .map(ProductTransparencyDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public Optional<ProductTransparencyDTO> getProductTransparencyById(String id) {
        return productRepository.findById(id)
                .map(ProductTransparencyDTO::fromEntity);
    }

    @Transactional
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    @Transactional
    public List<Product> saveAllProducts(List<Product> products) {
        return productRepository.saveAll(products);
    }

    public long countProducts() {
        return productRepository.count();
    }
}
