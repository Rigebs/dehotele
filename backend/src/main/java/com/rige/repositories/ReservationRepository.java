package com.rige.repositories;

import com.rige.entities.ReservationEntity;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<ReservationEntity, Long>,
        JpaSpecificationExecutor<ReservationEntity> {


    @NonNull
    @Override
    @EntityGraph(attributePaths = {"user", "room", "room.hotel", "room.hotel.amenities"})
    Page<ReservationEntity> findAll(@NonNull Specification<ReservationEntity> spec,
                                    @NonNull Pageable pageable);

    @Query("""
    SELECT r FROM ReservationEntity r
    WHERE r.room.id = :roomId
    AND r.status <> 'CANCELLED'
    AND (
        :checkIn < r.checkOutDate
        AND :checkOut > r.checkInDate
    )
""")
    List<ReservationEntity> findConflictingReservations(
            Long roomId,
            LocalDate checkIn,
            LocalDate checkOut
    );

    @Query("SELECT COALESCE(SUM(r.totalPrice), 0) FROM ReservationEntity r WHERE r.status IN ('CREATED', 'COMPLETED')")
    BigDecimal calculateTotalRevenue();

    // 2. Gráfico de ingresos por mes (Sintaxis MySQL: MONTH())
    @Query("SELECT MONTH(r.createdAt), SUM(r.totalPrice) " +
            "FROM ReservationEntity r WHERE r.status IN ('CREATED', 'COMPLETED') " +
            "GROUP BY MONTH(r.createdAt)")
    List<Object[]> findRevenueByMonth();

    @EntityGraph(attributePaths = {"user", "room"})
    List<ReservationEntity> findTop5ByOrderByCreatedAtDesc();

    @Query("""
            SELECT r FROM ReservationEntity r\s
            WHERE r.room.id = :roomId\s
            AND r.id <> :excludeId\s
            AND r.status <> 'CANCELLED'\s
            AND (:checkIn < r.checkOutDate AND :checkOut > r.checkInDate)
       \s""")
    List<ReservationEntity> findConflictingReservationsExcludingId(
            @Param("roomId") Long roomId,
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut,
            @Param("excludeId") Long excludeId
    );

    // 4. Reservas Activas Hoy
    // Corregido: Filtramos por CREATED (o el estado que consideres válido para ocupar la habitación)
    @Query("SELECT COUNT(r) FROM ReservationEntity r " +
            "WHERE r.status = 'CREATED' " +
            "AND :today BETWEEN r.checkInDate AND r.checkOutDate")
    long countActiveReservationsNow(@Param("today") LocalDate today);
}
