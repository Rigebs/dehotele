package com.rige.services.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.rige.exceptions.BadRequestException;
import com.rige.services.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryServiceImpl implements CloudinaryService {

    private final Cloudinary cloudinary;

    @Override
    public String uploadImage(MultipartFile file, String subFolder) {

        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }

        if (subFolder == null || subFolder.isBlank()) {
            throw new BadRequestException("Subfolder is required");
        }

        if (!subFolder.matches("^[a-zA-Z0-9-_]+$")) {
            throw new BadRequestException("Invalid folder name");
        }

        String finalFolder = "dehotele/" + subFolder;

        try {
            Map<?, ?> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", finalFolder
                    )
            );

            return result.get("secure_url").toString();

        } catch (IOException e) {
            throw new BadRequestException("Error uploading image");
        }
    }

    @Override
    public void deleteImage(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            throw new BadRequestException("Error deleting image");
        }
    }
}