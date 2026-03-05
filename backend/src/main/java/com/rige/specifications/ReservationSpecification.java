package com.rige.specifications;

import com.rige.entities.ReservationEntity;
import com.rige.filters.ReservationFilter;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ReservationSpecification {

    public static Specification<ReservationEntity> build(ReservationFilter filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.getHotelId() != null) {
                predicates.add(cb.equal(root.get("room").get("hotel").get("id"), filter.getHotelId()));
            }

            if (filter.getUserId() != null) {
                predicates.add(cb.equal(root.get("user").get("id"), filter.getUserId()));
            }

            if (filter.getRoomId() != null) {
                predicates.add(cb.equal(root.get("room").get("id"), filter.getRoomId()));
            }

            if (filter.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), filter.getStatus()));
            }

            if (filter.getStartDate() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("checkInDate"), filter.getStartDate()));
            }

            if (filter.getEndDate() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("checkOutDate"), filter.getEndDate()));
            }

            if (filter.getSearch() != null && !filter.getSearch().isEmpty()) {
                String searchPattern = "%" + filter.getSearch().toLowerCase() + "%";

                Predicate guestPredicate = cb.like(cb.lower(root.get("user").get("fullName")), searchPattern);

                Predicate roomPredicate = cb.like(root.get("room").get("name"), searchPattern);

                predicates.add(cb.or(guestPredicate, roomPredicate));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}