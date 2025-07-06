package com.thesis_formatter.thesis_formatter.repo;

import com.thesis_formatter.thesis_formatter.entity.FormRecordField;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FormRecordFieldRepo extends JpaRepository<FormRecordField, String> {
    FormRecordField findByFormRecordFieldId(String id);
}
