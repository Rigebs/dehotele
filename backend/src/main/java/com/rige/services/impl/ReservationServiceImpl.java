package com.rige.services.impl;

import com.rige.dto.request.ReservationRequest;
import com.rige.dto.request.UpdateReservationRequest;
import com.rige.dto.response.ReservationResponse;
import com.rige.entities.ReservationEntity;
import com.rige.entities.RoomEntity;
import com.rige.entities.UserEntity;
import com.rige.enums.ReservationStatus;
import com.rige.exceptions.BadRequestException;
import com.rige.exceptions.ResourceNotFoundException;
import com.rige.filters.ReservationFilter;
import com.rige.mappers.ReservationMapper;
import com.rige.repositories.ReservationRepository;
import com.rige.repositories.RoomRepository;
import com.rige.repositories.UserRepository;
import com.rige.security.CustomUserDetails;
import com.rige.services.EmailService;
import com.rige.services.ReservationService;
import com.rige.specifications.ReservationSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
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
    private final EmailService emailService;

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

        UserEntity user = getCurrentUser();

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

        ReservationEntity savedReservation = reservationRepository.save(reservation);

        emailService.sendReservationConfirmation(savedReservation);

        return reservationMapper.toResponseDTO(savedReservation);
    }

    @Override
    public ReservationResponse findById(Long id) {

        ReservationEntity res = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));

        return reservationMapper.toResponseDTO(res);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReservationResponse> findByUser(Long userId, ReservationFilter filter, Pageable pageable) {

        filter.setUserId(userId);

        Specification<ReservationEntity> spec = ReservationSpecification.build(filter);

        return reservationRepository.findAll(spec, pageable)
                .map(reservationMapper::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public boolean isAvailable(Long roomId, LocalDate checkIn, LocalDate checkOut) {
        return reservationRepository
                .findConflictingReservations(roomId, checkIn, checkOut)
                .isEmpty();
    }

    @Override
    @Transactional
    public void cancel(Long reservationId) {

        UserEntity user = getCurrentUser();

        ReservationEntity reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));

        if (!reservation.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You cannot cancel this reservation");
        }

        if (reservation.getStatus() == ReservationStatus.CANCELLED) {
            throw new BadRequestException("Reservation already cancelled");
        }

        emailService.sendReservationCancellation(reservation);

        reservation.setStatus(ReservationStatus.CANCELLED);
    }

    @Override
    @Transactional
    public void complete(Long id) {

        ReservationEntity reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada"));

        if (reservation.getStatus() == ReservationStatus.COMPLETED) {
            throw new BadRequestException("La reserva ya ha sido completada anteriormente");
        }

        if (reservation.getStatus() == ReservationStatus.CANCELLED) {
            throw new BadRequestException("No se puede completar una reserva que ha sido cancelada");
        }

        reservation.setStatus(ReservationStatus.COMPLETED);

        reservationRepository.save(reservation);
    }

    @Override
    @Transactional
    public ReservationResponse update(Long id, UpdateReservationRequest dto) {

        if (dto.getCheckOutDate().isBefore(dto.getCheckInDate())
                || dto.getCheckOutDate().isEqual(dto.getCheckInDate())) {
            throw new BadRequestException("La fecha de salida debe ser posterior a la de entrada");
        }

        ReservationEntity reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada"));

        UserEntity currentUser = getCurrentUser();

        if (!reservation.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("No tienes permiso para modificar esta reserva");
        }

        List<ReservationEntity> conflicts = reservationRepository
                .findConflictingReservationsExcludingId(
                        reservation.getRoom().getId(),
                        dto.getCheckInDate(),
                        dto.getCheckOutDate(),
                        id
                );

        if (!conflicts.isEmpty()) {
            throw new BadRequestException("La habitación no está disponible para las nuevas fechas seleccionadas");
        }

        long days = ChronoUnit.DAYS.between(dto.getCheckInDate(), dto.getCheckOutDate());

        BigDecimal newTotalPrice = reservation.getRoom()
                .getPricePerNight()
                .multiply(BigDecimal.valueOf(days));

        reservation.setCheckInDate(dto.getCheckInDate());
        reservation.setCheckOutDate(dto.getCheckOutDate());
        reservation.setTotalPrice(newTotalPrice);

        return reservationMapper.toResponseDTO(reservationRepository.save(reservation));
    }

    private UserEntity getCurrentUser() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !(auth.getPrincipal() instanceof CustomUserDetails userDetails)) {
            throw new BadRequestException("Usuario no autenticado");
        }

        return userRepository.findById(userDetails.id())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReservationResponse> findAll(ReservationFilter filter, Pageable pageable) {

        Specification<ReservationEntity> spec = ReservationSpecification.build(filter);

        return reservationRepository.findAll(spec, pageable)
                .map(reservationMapper::toResponseDTO);
    }
}