package com.rige.services.impl;

import com.rige.entities.ReservationEntity;
import com.rige.services.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendReservationConfirmation(ReservationEntity reservation) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(reservation.getUser().getEmail());
        message.setSubject("Confirmación de Reserva - Dehotele");
        message.setText(String.format(
            "Hola %s,\n\nTu reserva ha sido confirmada con éxito.\n" +
            "Hotel: %s\n" +
            "Fecha de entrada: %s\n" +
            "Fecha de salida: %s\n" +
            "Total pagado: $%s\n\n¡Gracias por elegirnos!",
            reservation.getUser().getFullName(),
            reservation.getRoom().getHotel().getName(),
            reservation.getCheckInDate(),
            reservation.getCheckOutDate(),
            reservation.getTotalPrice()
        ));
        mailSender.send(message);
    }

    @Override
    public void sendReservationCancellation(ReservationEntity reservation) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(reservation.getUser().getEmail());
        message.setSubject("Reserva Cancelada - Dehotele");
        message.setText("Tu reserva para las fechas " + reservation.getCheckInDate() + " ha sido cancelada.");
        mailSender.send(message);
    }
}