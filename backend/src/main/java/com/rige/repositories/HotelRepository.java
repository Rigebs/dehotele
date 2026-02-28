package com.rige.repositories;

import com.rige.entities.HotelEntity;
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

import java.time.LocalDate;

@Repository
public interface HotelRepository extends JpaRepository<HotelEntity, Long>, JpaSpecificationExecutor<HotelEntity> {

  Page<HotelEntity> findByActiveTrue(Pageable pageable);

  @Query("SELECT h FROM HotelEntity h " +
          "WHERE h.city = :city " +
          "AND h.active = true " +
          "AND EXISTS (" +
          "    SELECT r FROM RoomEntity r " +
          "    WHERE r.hotel = h " +
          "    AND r.active = true " +
          "    AND r.capacity >= :capacity " +
          "    AND NOT EXISTS (" +
          "        SELECT res FROM ReservationEntity res " +
          "        WHERE res.room = r " +
          "        AND res.status <> 'CANCELLED' " +
          "        AND :checkIn < res.checkOutDate " +
          "        AND :checkOut > res.checkInDate" +
          "    )" +
          ")")
  Page<HotelEntity> findAvailableHotels(
          @Param("city") String city,
          @Param("capacity") Integer capacity,
          @Param("checkIn") LocalDate checkIn,
          @Param("checkOut") LocalDate checkOut,
          Pageable pageable
  );

  @NonNull
  Page<HotelEntity> findAll(@NonNull Specification<HotelEntity> spec, @NonNull Pageable pageable);
}
