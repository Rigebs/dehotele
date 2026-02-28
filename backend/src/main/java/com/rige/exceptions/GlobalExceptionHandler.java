package com.rige.exceptions;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<?> handleNotFound(ResourceNotFoundException ex) {

    log.error("Resource not found", ex);

    return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "message", ex.getMessage(),
                    "status", 404
            ));
  }

  @ExceptionHandler(BadRequestException.class)
  public ResponseEntity<?> handleBadRequest(BadRequestException ex) {

    log.error("Bad request", ex);

    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "message", ex.getMessage(),
                    "status", 400
            ));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<?> handleValidation(MethodArgumentNotValidException ex) {

    log.error("Validation error", ex);

    Map<String, String> errors = new HashMap<>();

    ex.getBindingResult().getFieldErrors()
            .forEach(error ->
                    errors.put(error.getField(), error.getDefaultMessage())
            );

    return ResponseEntity.badRequest()
            .body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "errors", errors,
                    "status", 400
            ));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<?> handleGeneric(Exception ex) {

    log.error("Unhandled exception", ex);

    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "message", "Unexpected error occurred",
                    "status", 500
            ));
  }
}