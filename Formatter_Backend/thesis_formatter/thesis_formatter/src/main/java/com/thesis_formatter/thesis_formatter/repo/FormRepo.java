package com.thesis_formatter.thesis_formatter.repo;

import com.thesis_formatter.thesis_formatter.entity.Form;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Repository
public interface FormRepo extends JpaRepository<Form, String> {
    Optional<Form> findByReadersListContainingIgnoreCase(String reader);

    Form findByFormId(String formId);

    boolean existsByFormId(String formId);

    boolean existsByTitleIgnoreCase(String title);
}
