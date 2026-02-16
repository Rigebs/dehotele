package com.rige.mappers;

import com.rige.dto.request.HotelRequest;
import com.rige.dto.response.HotelResponse;
import com.rige.entities.HotelEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface HotelMapper {

    HotelEntity toEntity(HotelRequest dto);

    HotelResponse toResponseDTO(HotelEntity entity);
}
