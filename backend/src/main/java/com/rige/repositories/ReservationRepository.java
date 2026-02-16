package com.rige.repositories;

import com.rige.entities.ReservationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<ReservationEntity, Long> {

    List<ReservationEntity> findByUserId(Long userId);

    @Query("""
        SELECT r FROM ReservationEntity r
        WHERE r.room.id = :roomId
        AND r.status <> 'CANCELLED'
        AND (
            (:checkIn BETWEEN r.checkInDate AND r.checkOutDate)
            OR
            (:checkOut BETWEEN r.checkInDate AND r.checkOutDate)
            OR
            (r.checkInDate BETWEEN :checkIn AND :checkOut)
        )
    """)
    List<ReservationEntity> findConflictingReservations(
        Long roomId,
        LocalDate checkIn,
        LocalDate checkOut
    );
}
