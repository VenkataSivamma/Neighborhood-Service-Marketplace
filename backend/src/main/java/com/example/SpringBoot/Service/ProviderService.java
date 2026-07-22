package com.example.SpringBoot.Service;

import com.example.SpringBoot.DTO.ProviderDTO;
import com.example.SpringBoot.Exception.ProviderNotFoundException;
import com.example.SpringBoot.Mapper.ProviderMapper;
import com.example.SpringBoot.Model.Provider;
import com.example.SpringBoot.Model.Provider.ProviderStatus;
import com.example.SpringBoot.Repository.ProviderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProviderService {

    private final ProviderRepository providerRepository;
    private final ProviderMapper providerMapper;

    public ProviderService(ProviderRepository providerRepository, ProviderMapper providerMapper) {
        this.providerRepository = providerRepository;
        this.providerMapper = providerMapper;
    }

    public ProviderDTO createProvider(ProviderDTO dto) {
        return providerMapper.toDTO(providerRepository.save(providerMapper.toEntity(dto)));
    }

    public ProviderDTO getProviderById(long id) {
        return providerMapper.toDTO(findById(id));
    }

    public List<ProviderDTO> getAllProviders() {
        return providerRepository.findAll().stream().map(providerMapper::toDTO).collect(Collectors.toList());
    }

    public ProviderDTO updateProvider(long id, ProviderDTO dto) {
        Provider provider = findById(id);
        provider.setFullName(dto.getFullName());
        provider.setEmail(dto.getEmail());
        provider.setPhoneNumber(dto.getPhoneNumber());
        provider.setCity(dto.getCity());
        provider.setCategory(dto.getCategory());
        return providerMapper.toDTO(providerRepository.save(provider));
    }

    public void deleteProvider(long id) {
        providerRepository.delete(findById(id));
    }

    public List<ProviderDTO> getProvidersByCategory(String category) {
        return providerRepository.findByCategory(category).stream().map(providerMapper::toDTO).collect(Collectors.toList());
    }

    public List<ProviderDTO> getProvidersByCity(String city) {
        return providerRepository.findByCity(city).stream().map(providerMapper::toDTO).collect(Collectors.toList());
    }

    public ProviderDTO approveProvider(long id) {
        return updateStatus(id, ProviderStatus.APPROVED);
    }

    public ProviderDTO rejectProvider(long id) {
        return updateStatus(id, ProviderStatus.REJECTED);
    }

    public ProviderDTO suspendProvider(long id) {
        return updateStatus(id, ProviderStatus.SUSPENDED);
    }

    private ProviderDTO updateStatus(long id, ProviderStatus status) {
        Provider provider = findById(id);
        provider.setStatus(status);
        return providerMapper.toDTO(providerRepository.save(provider));
    }

    private Provider findById(long id) {
        return providerRepository.findById(id)
                .orElseThrow(() -> new ProviderNotFoundException("Provider not found with id: " + id));
    }
}
