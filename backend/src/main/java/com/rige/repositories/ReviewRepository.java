package com.rige.repositories;

import com.rige.entities.ReviewEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {

    Page<ReviewEntity> findByHotelId(Long hotelId, Pageable pageable);
    boolean existsByHotelIdAndUserId(Long hotelId, Long userId);
}