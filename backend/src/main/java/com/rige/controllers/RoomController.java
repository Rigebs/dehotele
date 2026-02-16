package com.rige.controllers;

import com.rige.dto.request.RoomRequest;
import com.rige.dto.response.RoomResponse;
import com.rige.services.RoomService;
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
@RequestMapping("/api")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @GetMapping("/hotels/{hotelId}/rooms")
    public Page<RoomResponse> getRoomsByHotel(
            @PathVariable Long hotelId,
            Pageable pageable) {
        return roomService.findByHotel(hotelId, pageable);
    }

    @PostMapping("/hotels/{hotelId}/rooms")
    public ResponseEntity<RoomResponse> create(
            @PathVariable Long hotelId,
            @Valid @RequestBody RoomRequest dto) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(roomService.create(hotelId, dto));
    }

    @PutMapping("/rooms/{roomId}")
    public RoomResponse update(
            @PathVariable Long roomId,
            @Valid @RequestBody RoomRequest dto) {

        return roomService.update(roomId, dto);
    }

    @DeleteMapping("/rooms/{roomId}")
    public ResponseEntity<Void> delete(@PathVariable Long roomId) {

        roomService.delete(roomId);
        return ResponseEntity.noContent().build();
    }
}
