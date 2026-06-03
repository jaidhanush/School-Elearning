package school.controller;


import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import school.storage.FileStorageService;


import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.concurrent.CompletableFuture;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/files")
public class FileController {

    private final FileStorageService s3Service;

    @Operation(summary = "Upload image")
    @PostMapping(
            value = "/upload/image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public CompletableFuture<String> uploadImage(
            @RequestPart("file") MultipartFile file
    ) throws IOException {

       
            return  s3Service.uploadFile(
                        file,
                        "courses/images"
                );

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
    public CompletableFuture<String> uploadVideo(
            @RequestPart("file") MultipartFile file
    ) throws IOException {

      
              return  s3Service.uploadFile(
                        file,
                        "courses/videos"
                );

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
    public CompletableFuture<String> uploadPdf(
            @RequestPart("file") MultipartFile file
    ) throws IOException {

        
            return s3Service.uploadFile(
                        file,
                        "courses/pdf"
                );

       
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