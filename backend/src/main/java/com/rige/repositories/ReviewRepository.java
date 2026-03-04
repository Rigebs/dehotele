package com.rige.repositories;

import com.rige.entities.ReviewEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {

    Page<ReviewEntity> findByHotelId(Long hotelId, Pageable pageable);

    boolean existsByHotelIdAndUserId(Long hotelId, Long userId);

    // Para el feed de reseñas críticas (Alertas)
    List<ReviewEntity> findTop5ByRatingLessThanEqualOrderByCreatedAtDesc(Integer rating);

    // Conteo total para el dashboard
    long count();
}