package com.thesis_formatter.thesis_formatter.repo;

import com.thesis_formatter.thesis_formatter.entity.Form;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FormRepo extends JpaRepository<Form, String> {
}
