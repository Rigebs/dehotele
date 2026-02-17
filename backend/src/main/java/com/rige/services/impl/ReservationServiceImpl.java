package com.rige.services.impl;

import com.rige.dto.request.ReservationRequest;
import com.rige.dto.response.ReservationResponse;
import com.rige.entities.ReservationEntity;
import com.rige.entities.RoomEntity;
import com.rige.entities.UserEntity;
import com.rige.enums.ReservationStatus;
import com.rige.exceptions.BadRequestException;
import com.rige.exceptions.ResourceNotFoundException;
import com.rige.mappers.ReservationMapper;
import com.rige.repositories.ReservationRepository;
import com.rige.repositories.RoomRepository;
import com.rige.repositories.UserRepository;
import com.rige.services.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final ReservationMapper reservationMapper;

    @Override
    public ReservationResponse create(ReservationRequest dto) {

        if (dto.getCheckOutDate().isBefore(dto.getCheckInDate())
                || dto.getCheckOutDate().isEqual(dto.getCheckInDate())) {
            throw new BadRequestException("Invalid reservation dates");
        }

        RoomEntity room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        if (!room.isActive()) {
            throw new BadRequestException("Room is not available");
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BadRequestException("User not authenticated");
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof UserEntity user)) {
            throw new BadRequestException("Invalid authentication principal");
        }

        List<ReservationEntity> conflicts = reservationRepository
                .findConflictingReservations(
                        room.getId(),
                        dto.getCheckInDate(),
                        dto.getCheckOutDate()
                );

        if (!conflicts.isEmpty()) {
            throw new BadRequestException("Room is not available for selected dates");
        }

        long days = ChronoUnit.DAYS.between(
                dto.getCheckInDate(),
                dto.getCheckOutDate()
        );

        BigDecimal totalPrice = room.getPricePerNight()
                .multiply(BigDecimal.valueOf(days));

        ReservationEntity reservation = ReservationEntity.builder()
                .room(room)
                .user(user)
                .checkInDate(dto.getCheckInDate())
                .checkOutDate(dto.getCheckOutDate())
                .totalPrice(totalPrice)
                .status(ReservationStatus.CREATED)
                .build();

        return reservationMapper.toResponseDTO(
                reservationRepository.save(reservation)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservationResponse> findByUser(Long userId) {

        return reservationRepository.findByUserId(userId)
                .stream()
                .map(reservationMapper::toResponseDTO)
                .toList();
    }

    @Override
    public void cancel(Long reservationId) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BadRequestException("User not authenticated");
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof UserEntity user)) {
            throw new BadRequestException("User not authenticated");
        }

        ReservationEntity reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));

        if (!reservation.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You cannot cancel this reservation");
        }

        if (reservation.getStatus() == ReservationStatus.CANCELLED) {
            throw new BadRequestException("Reservation already cancelled");
        }

        reservation.setStatus(ReservationStatus.CANCELLED);
    }


    @Override
    @Transactional(readOnly = true)
    public Page<ReservationResponse> findAll(Pageable pageable) {

        return reservationRepository.findAll(pageable)
                .map(reservationMapper::toResponseDTO);
    }
}
