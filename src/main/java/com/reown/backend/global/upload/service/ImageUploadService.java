package com.reown.backend.global.upload.service;

import com.reown.backend.global.upload.dto.ImageUploadResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageUploadService {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            MediaType.IMAGE_JPEG_VALUE,
            MediaType.IMAGE_PNG_VALUE,
            MediaType.IMAGE_GIF_VALUE,
            "image/webp"
    );

    private static final Map<String, String> EXTENSION_BY_CONTENT_TYPE = Map.of(
            MediaType.IMAGE_JPEG_VALUE, ".jpg",
            MediaType.IMAGE_PNG_VALUE, ".png",
            MediaType.IMAGE_GIF_VALUE, ".gif",
            "image/webp", ".webp"
    );

    @Value("${reown.upload.root-dir:./reown-uploads}")
    private String uploadRootDir;

    @Value("${reown.upload.image-dir-name:images}")
    private String imageDirName;

    public ImageUploadResponse uploadImage(MultipartFile file) {
        validate(file);

        String contentType = file.getContentType();
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() == null ? "image" : file.getOriginalFilename());
        String extension = resolveExtension(originalFilename, contentType);

        LocalDate today = LocalDate.now();
        String year = String.valueOf(today.getYear());
        String month = String.format("%02d", today.getMonthValue());
        String storedFilename = UUID.randomUUID() + extension;

        Path targetDirectory = Paths.get(uploadRootDir, imageDirName, year, month).toAbsolutePath().normalize();
        Path targetPath = targetDirectory.resolve(storedFilename).normalize();

        if (!targetPath.startsWith(targetDirectory)) {
            throw new IllegalArgumentException("잘못된 파일 경로입니다.");
        }

        try {
            Files.createDirectories(targetDirectory);
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException e) {
            throw new IllegalStateException("이미지 파일 저장에 실패했습니다.", e);
        }

        String path = "/uploads/%s/%s/%s/%s".formatted(imageDirName, year, month, storedFilename);
        String url = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path(path)
                .toUriString();

        return new ImageUploadResponse(
                url,
                path,
                originalFilename,
                storedFilename,
                contentType,
                file.getSize()
        );
    }

    private void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("업로드할 이미지 파일을 선택해주세요.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("이미지 파일만 업로드할 수 있습니다. jpg, png, gif, webp 형식을 사용해주세요.");
        }
    }

    private String resolveExtension(String originalFilename, String contentType) {
        String extension = StringUtils.getFilenameExtension(originalFilename);
        if (extension != null && !extension.isBlank()) {
            String normalized = "." + extension.toLowerCase();
            if (Set.of(".jpg", ".jpeg", ".png", ".gif", ".webp").contains(normalized)) {
                return normalized.equals(".jpeg") ? ".jpg" : normalized;
            }
        }

        return EXTENSION_BY_CONTENT_TYPE.getOrDefault(contentType, ".jpg");
    }
}
