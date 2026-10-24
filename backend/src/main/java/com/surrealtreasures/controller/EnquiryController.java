package com.surrealtreasures.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.surrealtreasures.entity.Enquiry;
import com.surrealtreasures.repository.EnquiryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/enquiries")
@CrossOrigin(origins = "*")
public class EnquiryController {

    private final EnquiryRepository enquiryRepository;
    private final ObjectMapper objectMapper;

    public EnquiryController(EnquiryRepository enquiryRepository, ObjectMapper objectMapper) {
        this.enquiryRepository = enquiryRepository;
        this.objectMapper = objectMapper;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllEnquiries(@RequestParam(required = false) String status) {
        List<Enquiry> list = (status != null && !status.equalsIgnoreCase("All"))
                ? enquiryRepository.findByStatusOrderByCreatedAtDesc(status)
                : enquiryRepository.findAllByOrderByCreatedAtDesc();

        List<Map<String, Object>> result = new ArrayList<>();
        for (Enquiry e : list) {
            result.add(toMap(e));
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createEnquiry(@RequestBody Map<String, Object> payload) {
        Enquiry enquiry = new Enquiry();

        String id = (String) payload.get("id");
        if (id == null || id.trim().isEmpty()) {
            id = "ST-" + java.time.Year.now().getValue() + "-" + (1000 + new Random().nextInt(9000));
        }
        enquiry.setId(id);
        String custName = (String) payload.get("customerName");
        enquiry.setCustomerName(custName != null && !custName.trim().isEmpty() ? custName : "Guest Patron");

        String email = (String) payload.get("email");
        enquiry.setEmail(email != null && !email.trim().isEmpty() ? email : "patron@example.com");

        String phone = (String) payload.get("phone");
        enquiry.setPhone(phone != null && !phone.trim().isEmpty() ? phone : "Not provided");

        String contact = (String) payload.get("preferredContact");
        enquiry.setPreferredContact(contact != null && !contact.trim().isEmpty() ? contact : "WhatsApp");

        String location = (String) payload.get("deliveryLocation");
        enquiry.setDeliveryLocation(location != null && !location.trim().isEmpty() ? location : "Mumbai");

        String eventDate = (String) payload.get("eventDate");
        enquiry.setEventDate(eventDate != null && !eventDate.trim().isEmpty() ? eventDate : "Flexible");

        String notes = (String) payload.get("customNotes");
        enquiry.setCustomNotes(notes != null ? notes : "");

        String status = (String) payload.get("status");
        enquiry.setStatus(status != null && !status.trim().isEmpty() ? status : "New");

        String submittedAt = (String) payload.get("submittedAt");
        enquiry.setSubmittedAt(submittedAt != null && !submittedAt.trim().isEmpty() ? submittedAt : java.time.Instant.now().toString());

        String itemsSummary = (String) payload.get("itemsSummary");
        enquiry.setItemsSummary(itemsSummary != null && !itemsSummary.trim().isEmpty() ? itemsSummary : "Custom Hamper Selection");

        Object totalObj = payload.get("estimatedTotal");
        if (totalObj != null) {
            try {
                enquiry.setEstimatedTotal(new BigDecimal(totalObj.toString()));
            } catch (Exception ex) {
                enquiry.setEstimatedTotal(BigDecimal.ZERO);
            }
        } else {
            enquiry.setEstimatedTotal(BigDecimal.ZERO);
        }

        Object detailsObj = payload.get("details");
        if (detailsObj != null) {
            try {
                enquiry.setDetailsJson(objectMapper.writeValueAsString(detailsObj));
            } catch (Exception ex) {
                enquiry.setDetailsJson(detailsObj.toString());
            }
        } else {
            enquiry.setDetailsJson("{}");
        }

        Enquiry saved = enquiryRepository.save(enquiry);
        return ResponseEntity.status(HttpStatus.CREATED).body(toMap(saved));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateEnquiryStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> updateBody) {

        return enquiryRepository.findById(id).map(enquiry -> {
            if (updateBody.containsKey("status")) {
                enquiry.setStatus(updateBody.get("status"));
            }
            if (updateBody.containsKey("internalNote")) {
                enquiry.setInternalNotes(updateBody.get("internalNote"));
            }
            Enquiry updated = enquiryRepository.save(enquiry);
            return ResponseEntity.ok(toMap(updated));
        }).orElse(ResponseEntity.notFound().build());
    }

    private Map<String, Object> toMap(Enquiry e) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", e.getId());
        map.put("customerName", e.getCustomerName());
        map.put("email", e.getEmail());
        map.put("phone", e.getPhone());
        map.put("preferredContact", e.getPreferredContact());
        map.put("deliveryLocation", e.getDeliveryLocation());
        map.put("eventDate", e.getEventDate());
        map.put("customNotes", e.getCustomNotes());
        map.put("status", e.getStatus());
        map.put("estimatedTotal", e.getEstimatedTotal());
        map.put("itemsSummary", e.getItemsSummary());
        map.put("submittedAt", e.getSubmittedAt());
        map.put("internalNote", e.getInternalNotes());

        if (e.getDetailsJson() != null && !e.getDetailsJson().isEmpty()) {
            try {
                map.put("details", objectMapper.readValue(e.getDetailsJson(), Map.class));
            } catch (Exception ex) {
                map.put("details", e.getDetailsJson());
            }
        } else {
            map.put("details", Collections.emptyMap());
        }

        return map;
    }
}
