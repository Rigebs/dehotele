package com.rige.mappers;

import com.rige.dto.request.RoomRequest;
import com.rige.dto.response.RoomResponse;
import com.rige.entities.RoomEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RoomMapper {

    RoomEntity toEntity(RoomRequest dto);

    @Mapping(target = "hotel.rooms", ignore = true)
    RoomResponse toResponseDTO(RoomEntity entity);
}
