# Booking System - Full Stack Project

Simplified Booking.com-like reservation system built as a professional
portfolio project.

---

# 🏗 Project Architecture

This repository contains both:

- Backend → Spring Boot (REST API)
- Frontend → Angular (Standalone Architecture)

The project follows professional full-stack architecture standards
including layered backend design, DTO separation, validation, security
(planned), and scalable frontend structure.

---

# 🔵 Backend (Spring Boot)

## Tech Stack

- Spring Boot
- Spring Web
- Spring Data JPA
- Hibernate
- MySQL
- Lombok
- MapStruct
- Jakarta Validation
- Swagger (springdoc-openapi)

---

## Architecture

Layered architecture:

    controllers/
    services/
    services/impl/
    repositories/
    entities/
    dto/
    mappers/
    exceptions/
    config/

### Principles Applied

- Entities are never exposed directly
- DTOs used for API communication
- MapStruct for mapping
- Indexed database columns for performance
- Enums stored as STRING
- Proper relationship design
- Soft delete ready (active flags)
- Specification-ready repositories for dynamic filters

---

## Database Design

### Entities

- User
- Hotel
- Room
- Reservation

### Relationships

- User 1 → \* Reservation
- Hotel 1 → \* Room
- Room 1 → \* Reservation

### Indexing Strategy

- Unique index on user email
- Index on hotel city
- Index on room hotel_id
- Index on reservation (room_id, check_in_date, check_out_date)

---

## Current Status

✔ Entities created\
✔ Repositories implemented\
✔ DTOs structured (request/response)\
✔ MapStruct mappers configured\
✔ MySQL connection configured\
✔ Professional package structure

Security, business logic, and controllers will be implemented in
upcoming phases.

---

# 🟢 Frontend (Angular - Planned)

## Planned Stack

- Angular (latest stable version)
- Standalone Components
- Reactive Forms
- Lazy Loading
- Route Guards
- HTTP Interceptors (JWT)
- Global Error Handling
- Clean UI Architecture

---

## Planned Features

### User

- Register
- Login
- View hotels
- Filter by dates
- Book room
- Cancel reservation
- View reservation history

### Admin

- CRUD Hotels
- CRUD Rooms
- View all reservations
- Update reservation status

Frontend implementation will begin after backend core logic and security
are completed.

---

# 🚀 How to Run Backend

1.  Create MySQL database:

```sql
CREATE DATABASE dehotele_db;
```

2.  Update credentials in:

```
src/main/resources/application.yml
```

3.  Run:

```
mvn spring-boot:run
```

---

# 📌 Development Roadmap

- Phase 1 → Database & Entities
- Phase 2 → Base Backend (No Security)
- Phase 3 → JWT + Roles
- Phase 4 → Reservation Logic & Validations
- Phase 5 → Angular Base Setup
- Phase 6 → Integration
- Phase 7 → Deployment
- Phase 8 → Optimization & Advanced Improvements

---

# 🎯 Goal

This project is designed to demonstrate production-ready backend
architecture and scalable frontend integration suitable for mid-level
full-stack roles.

---

Author: \[Rigebs\]