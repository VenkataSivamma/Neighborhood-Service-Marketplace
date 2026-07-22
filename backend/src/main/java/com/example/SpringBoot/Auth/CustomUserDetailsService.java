package com.example.SpringBoot.Auth;

import com.example.SpringBoot.Model.Customer;
import com.example.SpringBoot.Model.Provider;
import com.example.SpringBoot.Repository.CustomerRepository;
import com.example.SpringBoot.Repository.ProviderRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final CustomerRepository customerRepository;
    private final ProviderRepository providerRepository;

    public CustomUserDetailsService(CustomerRepository customerRepository, ProviderRepository providerRepository) {
        this.customerRepository = customerRepository;
        this.providerRepository = providerRepository;
    }

    private static final String ADMIN_EMAIL = "admin@marketplace.com";

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        if (ADMIN_EMAIL.equalsIgnoreCase(email)) {
            return new User(ADMIN_EMAIL, "",
                    List.of(new SimpleGrantedAuthority("ROLE_ADMIN")));
        }

        Optional<Customer> customer = customerRepository.findByEmail(email);
        if (customer.isPresent()) {
            return new User(customer.get().getEmail(), customer.get().getPassword(),
                    List.of(new SimpleGrantedAuthority("ROLE_CUSTOMER")));
        }

        Optional<Provider> provider = providerRepository.findByEmail(email);
        if (provider.isPresent()) {
            return new User(provider.get().getEmail(), provider.get().getPassword(),
                    List.of(new SimpleGrantedAuthority("ROLE_PROVIDER")));
        }

        throw new UsernameNotFoundException("User not found with email: " + email);
    }
}
