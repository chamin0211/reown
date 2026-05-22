package com.reown.backend.global.upload.dto;

public record ImageUploadResponse(
        String url,
        String path,
        String originalFilename,
        String storedFilename,
        String contentType,
        long size
) {
}
