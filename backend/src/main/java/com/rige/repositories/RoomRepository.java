package com.rige.repositories;

import com.rige.entities.RoomEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<RoomEntity, Long>, JpaSpecificationExecutor<RoomEntity> {

  @Query("SELECT r FROM RoomEntity r " +
          "WHERE r.hotel.id = :hotelId " +
          "AND r.active = true " +
          "AND (:capacity IS NULL OR r.capacity >= :capacity) " +
          "AND (" +
          "    :checkIn IS NULL OR :checkOut IS NULL OR NOT EXISTS (" +
          "        SELECT res FROM ReservationEntity res " +
          "        WHERE res.room = r " +
          "        AND res.status <> 'CANCELLED' " +
          "        AND :checkIn < res.checkOutDate " +
          "        AND :checkOut > res.checkInDate" +
          "    )" +
          ")")
  List<RoomEntity> findAvailableRoomsByHotel(
          @Param("hotelId") Long hotelId,
          @Param("capacity") Integer capacity,
          @Param("checkIn") LocalDate checkIn,
          @Param("checkOut") LocalDate checkOut
  );

  // Total de habitaciones operativas en todo el sistema
  long countByActiveTrue();
}
