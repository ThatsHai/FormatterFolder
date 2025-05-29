package com.thesis_formatter.thesis_formatter.entity;

import com.thesis_formatter.thesis_formatter.dto.request.TeacherSearchCriteria;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;

import java.util.ArrayList;
import java.util.List;

public class TeacherSpecification {

    public static Specification<Teacher> withCriteria(TeacherSearchCriteria criteria) {
        return (root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (criteria.getDepartmentId() != null) {
                predicates.add(builder.equal(root.get("department").get("departmentId"), criteria.getDepartmentId()));
            }

            if (criteria.getFacultyId() != null) {
                predicates.add(builder.equal(root.get("department").get("faculty").get("facultyId"), criteria.getFacultyId()));
            }

            if (criteria.getName() != null) {
                predicates.add(builder.like(builder.lower(root.get("name")), "%" + criteria.getName().toLowerCase() + "%"));
            }

            if (criteria.getUserId() != null && !criteria.getUserId().isEmpty()) {
                predicates.add(builder.equal(root.get("userId"), criteria.getUserId()));
            }

            return builder.and(predicates.toArray(new Predicate[0]));
        };
    }
}

