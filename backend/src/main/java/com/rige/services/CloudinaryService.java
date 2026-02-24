package com.rige.services;

import org.springframework.web.multipart.MultipartFile;

public interface CloudinaryService {

    String uploadImage(MultipartFile file, String subFolder);

    void deleteImage(String publicId);
}