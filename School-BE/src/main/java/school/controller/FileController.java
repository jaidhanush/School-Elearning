package school.controller;


import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import school.storage.file.S3Service;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/files")
public class FileController {

    private final S3Service s3Service;

    @Operation(summary = "Upload image")
    @PostMapping(
            value = "/upload/image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<String> uploadImage(
            @RequestPart("file") MultipartFile file
    ) throws IOException {

        String key =
                s3Service.uploadFile(
                        file,
                        "courses/images"
                );

        return ResponseEntity.ok(key);
    }

    /*
    ============================================================
                        UPLOAD VIDEO
    ============================================================
     */

    @Operation(summary = "Upload video")
    @PostMapping(
            value = "/upload/video",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<String> uploadVideo(
            @RequestPart("file") MultipartFile file
    ) throws IOException {

        String key =
                s3Service.uploadFile(
                        file,
                        "courses/videos"
                );

        return ResponseEntity.ok(key);
    }

    /*
    ============================================================
                        UPLOAD PDF
    ============================================================
     */

    @Operation(summary = "Upload pdf")
    @PostMapping(
            value = "/upload/pdf",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<String> uploadPdf(
            @RequestPart("file") MultipartFile file
    ) throws IOException {

        String key =
                s3Service.uploadFile(
                        file,
                        "courses/pdf"
                );

        return ResponseEntity.ok(key);
    }

    /*
    ============================================================
                        VIEW FILE
    ============================================================
     */

    @Operation(summary = "View image/video/pdf")
    @GetMapping("/view")
    public ResponseEntity<InputStreamResource> viewFile(
            @RequestParam String key
    ) {

        return s3Service.viewFile(key);
    }

    /*
    ============================================================
                        DOWNLOAD FILE
    ============================================================
     */

    @Operation(summary = "Download image/video/pdf")
    @GetMapping("/download")
    public ResponseEntity<InputStreamResource> downloadFile(
            @RequestParam String key
    ) {

        return s3Service.downloadFile(key);
    }
}