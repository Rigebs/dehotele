package com.rige.dto.request;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateReservationRequest {
    @NotNull(message = "La fecha de entrada es obligatoria")
    @FutureOrPresent(message = "La fecha de entrada debe ser hoy o en el futuro")
    private LocalDate checkInDate;

    @NotNull(message = "La fecha de salida es obligatoria")
    private LocalDate checkOutDate;
}