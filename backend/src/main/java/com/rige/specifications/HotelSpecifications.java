package com.rige.specifications;

import com.rige.entities.HotelEntity;
import com.rige.filters.HotelFilter;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class HotelSpecifications {

    public static Specification<HotelEntity> build(HotelFilter filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.getName() != null && !filter.getName().isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + filter.getName().toLowerCase() + "%"));
            }

            if (filter.getCity() != null && !filter.getCity().isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("city")), filter.getCity().toLowerCase()));
            }

            if (filter.getMinRating() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("rating"), filter.getMinRating()));
            }

            if (filter.getActive() != null) {
                predicates.add(cb.equal(root.get("active"), filter.getActive()));
            } else {
                predicates.add(cb.equal(root.get("active"), true));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}