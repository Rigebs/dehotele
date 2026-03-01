package com.rige.mappers;

import com.rige.dto.request.ReviewRequest;
import com.rige.dto.response.ReviewResponse;
import com.rige.entities.ReviewEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReviewMapper {

    ReviewEntity toEntity(ReviewRequest dto);

    @Mapping(source = "user.fullName", target = "authorName")
    @Mapping(source = "user.id", target = "authorId")
    ReviewResponse toResponseDTO(ReviewEntity entity);
}
