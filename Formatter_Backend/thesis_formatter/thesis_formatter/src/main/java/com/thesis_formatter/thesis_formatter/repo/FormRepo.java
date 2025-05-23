package com.thesis_formatter.thesis_formatter.repo;

import com.thesis_formatter.thesis_formatter.entity.Form;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FormRepo extends JpaRepository<Form, String> {
    List<Form> findByTeachers_TcId(String tcId);
//    List<Form> findByStudent_StId(String stId);
}
