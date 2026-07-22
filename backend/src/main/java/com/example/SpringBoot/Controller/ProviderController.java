package com.example.SpringBoot.Controller;

import com.example.SpringBoot.DTO.ProviderDTO;
import com.example.SpringBoot.Service.ProviderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/providers")
public class ProviderController {

    private final ProviderService providerService;

    public ProviderController(ProviderService providerService) {
        this.providerService = providerService;
    }

    @PostMapping
    public ResponseEntity<ProviderDTO> createProvider(@RequestBody ProviderDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(providerService.createProvider(dto));
    }

    @GetMapping
    public ResponseEntity<List<ProviderDTO>> getAllProviders() {
        return ResponseEntity.ok(providerService.getAllProviders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProviderDTO> getProviderById(@PathVariable long id) {
        return ResponseEntity.ok(providerService.getProviderById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProviderDTO> updateProvider(@PathVariable long id, @RequestBody ProviderDTO dto) {
        return ResponseEntity.ok(providerService.updateProvider(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProvider(@PathVariable long id) {
        providerService.deleteProvider(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProviderDTO>> getProvidersByCategory(@PathVariable String category) {
        return ResponseEntity.ok(providerService.getProvidersByCategory(category));
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<List<ProviderDTO>> getProvidersByCity(@PathVariable String city) {
        return ResponseEntity.ok(providerService.getProvidersByCity(city));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ProviderDTO> approveProvider(@PathVariable long id) {
        return ResponseEntity.ok(providerService.approveProvider(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ProviderDTO> rejectProvider(@PathVariable long id) {
        return ResponseEntity.ok(providerService.rejectProvider(id));
    }

    @PutMapping("/{id}/suspend")
    public ResponseEntity<ProviderDTO> suspendProvider(@PathVariable long id) {
        return ResponseEntity.ok(providerService.suspendProvider(id));
    }
}
