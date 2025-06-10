package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.entity.Design;
import com.thesis_formatter.thesis_formatter.repo.DesignRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DesignService {
    DesignRepo designRepo;

    public APIResponse<List<Design>> getDesigns() {
        List<Design> designs = designRepo.findAll();
        return APIResponse.<List<Design>>builder()
                .result(designs)
                .code("200")
                .build();
    }
}
