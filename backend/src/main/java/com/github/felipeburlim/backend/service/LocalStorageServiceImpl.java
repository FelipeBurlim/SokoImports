package com.github.felipeburlim.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class LocalStorageServiceImpl implements StorageService {

    @Value("${storage.local-dir}")
    private String uploadDir;

    @Override
    public String uploadFile(MultipartFile file, String objectKey) {
        try {
            Path path = Paths.get(uploadDir + objectKey);
            Files.createDirectories(path.getParent());
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
            return objectKey;
        } catch (IOException e) {
            throw new RuntimeException("Error saving file locally", e);
        }
    }

    @Override
    public void deleteFile(String objectKey) {
        try {
            Files.deleteIfExists(Paths.get(uploadDir + objectKey));
        } catch (IOException e) {
            throw new RuntimeException("Error deleting file", e);
        }
    }
}
