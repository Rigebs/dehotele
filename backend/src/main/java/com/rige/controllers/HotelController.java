package com.rige.controllers;

import com.rige.dto.request.HotelRequest;
import com.rige.dto.response.HotelResponse;
import com.rige.services.HotelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/hotels")
@RequiredArgsConstructor
public class HotelController {

    private final HotelService hotelService;

    @GetMapping
    public Page<HotelResponse> getAll(Pageable pageable) {
        return hotelService.findAll(pageable);
    }

    @GetMapping("/{id}")
    public HotelResponse getById(@PathVariable Long id) {
        return hotelService.findById(id);
    }

    @PostMapping
    public ResponseEntity<HotelResponse> create(
            @Valid @RequestBody HotelRequest dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(hotelService.create(dto));
    }

    @PutMapping("/{id}")
    public HotelResponse update(
            @PathVariable Long id,
            @Valid @RequestBody HotelRequest dto) {
        return hotelService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        hotelService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
