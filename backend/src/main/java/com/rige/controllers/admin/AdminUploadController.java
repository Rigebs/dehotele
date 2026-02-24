package com.rige.controllers.admin;

import com.rige.services.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/uploads")
@RequiredArgsConstructor
public class AdminUploadController {

    private final CloudinaryService cloudinaryService;

    @PostMapping("/{folder}")
    public ResponseEntity<Map<String, String>> uploadImage(
            @PathVariable String folder,
            @RequestParam("file") MultipartFile file
    ) {

        String imageUrl = cloudinaryService.uploadImage(file, folder);

        return ResponseEntity.ok(
                Map.of("url", imageUrl)
        );
    }
}