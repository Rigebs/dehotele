package com.rige.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import java.util.List;

@Entity
@Table(
        name = "hotels",
        indexes = {
                @Index(name = "idx_hotel_city", columnList = "city"),
                @Index(name = "idx_hotel_active", columnList = "active")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HotelEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(nullable = false, length = 200)
    private String address;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private boolean active;

    @Column(length = 500)
    private String imageUrl;

    @Column(nullable = false)
    private Double rating;

    @Column(nullable = false)
    private Integer reviewsCount;

    @ElementCollection
    @Fetch(FetchMode.SUBSELECT)
    @CollectionTable(
            name = "hotel_amenities",
            joinColumns = @JoinColumn(name = "hotel_id")
    )
    @Column(name = "amenity")
    private List<String> amenities;

    @OneToMany(
            mappedBy = "hotel",
            fetch = FetchType.LAZY,
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Fetch(FetchMode.SUBSELECT)
    private List<RoomEntity> rooms;

    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReviewEntity> reviews;

    public void updateRating(Integer newReviewRating) {
        if (this.rating == null) this.rating = 0.0;
        if (this.reviewsCount == null) this.reviewsCount = 0;

        double totalPoints = (this.rating * this.reviewsCount) + newReviewRating;
        this.reviewsCount++;

        double rawRating = totalPoints / this.reviewsCount;

        this.rating = Math.round(rawRating * 10.0) / 10.0;

        /*
        * 4.33333333333
        * 5.2222222222
        * */
    }
}