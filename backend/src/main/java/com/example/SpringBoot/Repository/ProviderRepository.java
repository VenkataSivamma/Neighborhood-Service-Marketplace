package com.example.SpringBoot.Repository;

import com.example.SpringBoot.Model.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProviderRepository extends JpaRepository<Provider, Long> {
    List<Provider> findByCategory(String category);
    List<Provider> findByCity(String city);
    Optional<Provider> findByEmail(String email);
}
