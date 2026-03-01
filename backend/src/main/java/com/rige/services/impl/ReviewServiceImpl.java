package com.rige.services.impl;

import com.rige.dto.request.ReviewRequest;
import com.rige.dto.response.ReviewResponse;
import com.rige.entities.HotelEntity;
import com.rige.entities.ReviewEntity;
import com.rige.entities.UserEntity;
import com.rige.exceptions.ResourceNotFoundException;
import com.rige.mappers.ReviewMapper;
import com.rige.repositories.HotelRepository;
import com.rige.repositories.ReviewRepository;
import com.rige.repositories.UserRepository;
import com.rige.services.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final HotelRepository hotelRepository;
    private final UserRepository userRepository;
    private final ReviewMapper reviewMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewResponse> findByHotelId(Long hotelId, Pageable pageable) {
        if (!hotelRepository.existsById(hotelId)) {
            throw new ResourceNotFoundException("Hotel con id " + hotelId + " no encontrado");
        }

        return reviewRepository.findByHotelId(hotelId, pageable)
                .map(reviewMapper::toResponseDTO);
    }

    @Override
    @Transactional
    public void addReview(Long hotelId, String userEmail, ReviewRequest request) {
        UserEntity user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        if (reviewRepository.existsByHotelIdAndUserId(hotelId, user.getId())) {
            throw new RuntimeException("Ya has dejado una reseña para este hotel");
        }

        HotelEntity hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel no encontrado"));

        ReviewEntity review = reviewMapper.toEntity(request);
        review.setHotel(hotel);
        review.setUser(user);

        hotel.updateRating(request.getRating());

        reviewRepository.save(review);
        hotelRepository.save(hotel);
    }
}