package com.github.felipeburlim.backend.service;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    String uploadFile (MultipartFile file, String objectKey);
    void deleteFile (String objectKey);
}
