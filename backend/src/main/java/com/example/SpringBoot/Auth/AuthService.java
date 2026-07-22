package com.example.SpringBoot.Auth;

import com.example.SpringBoot.DTO.AuthResponse;
import com.example.SpringBoot.DTO.LoginRequest;
import com.example.SpringBoot.DTO.RegisterRequest;
import com.example.SpringBoot.Model.Customer;
import com.example.SpringBoot.Model.Provider;
import com.example.SpringBoot.Repository.CustomerRepository;
import com.example.SpringBoot.Repository.ProviderRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final CustomerRepository customerRepository;
    private final ProviderRepository providerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(CustomerRepository customerRepository, ProviderRepository providerRepository,
                       PasswordEncoder passwordEncoder, JwtService jwtService,
                       AuthenticationManager authenticationManager) {
        this.customerRepository = customerRepository;
        this.providerRepository = providerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse registerCustomer(RegisterRequest request) {
        Customer customer = new Customer();
        customer.setFullName(request.getFullName());
        customer.setEmail(request.getEmail());
        customer.setPassword(passwordEncoder.encode(request.getPassword()));
        customer.setPhoneNumber(request.getPhoneNumber());
        customer.setCity(request.getCity());
        customer.setActive(true);
        customerRepository.save(customer);
        String token = jwtService.generateToken(customer.getEmail(), "ROLE_CUSTOMER");
        return new AuthResponse(token, "ROLE_CUSTOMER", customer.getEmail());
    }

    public AuthResponse loginCustomer(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        Customer customer = customerRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        String token = jwtService.generateToken(customer.getEmail(), "ROLE_CUSTOMER");
        return new AuthResponse(token, "ROLE_CUSTOMER", customer.getEmail());
    }

    public AuthResponse registerProvider(RegisterRequest request) {
        Provider provider = new Provider();
        provider.setFullName(request.getFullName());
        provider.setEmail(request.getEmail());
        provider.setPassword(passwordEncoder.encode(request.getPassword()));
        provider.setPhoneNumber(request.getPhoneNumber());
        provider.setCity(request.getCity());
        provider.setCategory(request.getCategory());
        provider.setStatus(Provider.ProviderStatus.PENDING);
        providerRepository.save(provider);
        String token = jwtService.generateToken(provider.getEmail(), "ROLE_PROVIDER");
        return new AuthResponse(token, "ROLE_PROVIDER", provider.getEmail());
    }

    public AuthResponse loginProvider(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        Provider provider = providerRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Provider not found"));
        String token = jwtService.generateToken(provider.getEmail(), "ROLE_PROVIDER");
        return new AuthResponse(token, "ROLE_PROVIDER", provider.getEmail());
    }
}
