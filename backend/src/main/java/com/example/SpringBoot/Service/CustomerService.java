package com.example.SpringBoot.Service;

import com.example.SpringBoot.DTO.CustomerDTO;
import com.example.SpringBoot.Exception.CustomerNotFoundException;
import com.example.SpringBoot.Mapper.CustomerMapper;
import com.example.SpringBoot.Model.Customer;
import com.example.SpringBoot.Repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    public CustomerService(CustomerRepository customerRepository, CustomerMapper customerMapper) {
        this.customerRepository = customerRepository;
        this.customerMapper = customerMapper;
    }

    public CustomerDTO createCustomer(CustomerDTO dto) {
        return customerMapper.toDTO(customerRepository.save(customerMapper.toEntity(dto)));
    }

    public CustomerDTO getCustomerById(long id) {
        return customerMapper.toDTO(findById(id));
    }

    public List<CustomerDTO> getAllCustomers() {
        return customerRepository.findAll().stream().map(customerMapper::toDTO).collect(Collectors.toList());
    }

    public CustomerDTO updateCustomer(long id, CustomerDTO dto) {
        Customer customer = findById(id);
        customer.setFullName(dto.getFullName());
        customer.setEmail(dto.getEmail());
        customer.setPhoneNumber(dto.getPhoneNumber());
        customer.setCity(dto.getCity());
        customer.setActive(dto.isActive());
        return customerMapper.toDTO(customerRepository.save(customer));
    }

    public void deleteCustomer(long id) {
        customerRepository.delete(findById(id));
    }

    public List<CustomerDTO> getCustomersByCity(String city) {
        return customerRepository.findByCity(city).stream().map(customerMapper::toDTO).collect(Collectors.toList());
    }

    private Customer findById(long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found with id: " + id));
    }
}
