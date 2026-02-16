package com.rige.mappers;

import com.rige.dto.request.ReservationRequest;
import com.rige.dto.response.ReservationResponse;
import com.rige.entities.ReservationEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReservationMapper {

    @Mapping(target = "room.id", source = "roomId")
    ReservationEntity toEntity(ReservationRequest dto);

    ReservationResponse toResponseDTO(ReservationEntity entity);
}
