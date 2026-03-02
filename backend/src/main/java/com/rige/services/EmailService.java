package com.rige.services;

import com.rige.entities.ReservationEntity;

public interface EmailService {

    void sendReservationConfirmation(ReservationEntity reservation);
    void sendReservationCancellation(ReservationEntity reservation);
}