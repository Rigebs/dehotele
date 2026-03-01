package com.rige.services;

import com.rige.dto.request.ReviewRequest;
import com.rige.dto.response.ReviewResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReviewService {
  Page<ReviewResponse> findByHotelId(Long hotelId, Pageable pageable);
  void addReview(Long hotelId, String userEmail, ReviewRequest request);
}
