package com.thesis_formatter.thesis_formatter.repo;

import com.thesis_formatter.thesis_formatter.entity.Account;
import com.thesis_formatter.thesis_formatter.entity.Student;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@DataJpaTest
class StudentRepoTest {
    @Autowired
    private StudentRepo studentRepo;

    @Test
    void submitStudent(){
    }

    @Test
    void getAll() {
        List<Student> students = studentRepo.findAll();

    }
}