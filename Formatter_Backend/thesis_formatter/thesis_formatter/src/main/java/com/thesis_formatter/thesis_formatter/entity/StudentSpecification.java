package com.thesis_formatter.thesis_formatter.entity;

import com.thesis_formatter.thesis_formatter.dto.request.StudentSearchCriteria;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class StudentSpecification {

    public static Specification<Student> withCriteria(StudentSearchCriteria criteria) {
        return (root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Filter by Class ID
            if (criteria.getClassId() != null) {
                predicates.add(builder.equal(root.get("studentClass").get("studentClassId"), criteria.getClassId()));
            }

            // Filter by Major ID (via StudentClass)
            if (criteria.getMajorId() != null) {
                predicates.add(builder.equal(root.get("studentClass").get("major").get("majorId"), criteria.getMajorId()));
            }

            // Filter by Name (LIKE)
            if (criteria.getName() != null) {
                predicates.add(builder.like(builder.lower(root.get("name")), "%" + criteria.getName().toLowerCase() + "%"));
            }

            // Filter by User ID (Exact match)
            if (criteria.getUserId() != null && !criteria.getUserId().isEmpty()) {
                predicates.add(builder.equal(root.get("userId"), criteria.getUserId()));
            }

            return builder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
