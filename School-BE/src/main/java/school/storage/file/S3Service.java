package school.storage.file;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import school.storage.FileStorageService;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;


@Service
@RequiredArgsConstructor
public class S3Service implements FileStorageService {

    private final S3Client s3Client;

    @Value("${aws.bucketName}")
    private String bucketName;

    /*
    ============================================================
                        UPLOAD FILE
    ============================================================
     */

    @Override
    @Async("fileUploadExecutor")
    public CompletableFuture<String> uploadFile(
            MultipartFile file,
            String folder
    ) throws IOException {

        String fileName =
                UUID.randomUUID()
                        + "_"
                        + file.getOriginalFilename();

        String key =
                folder + "/" + fileName;

        PutObjectRequest request =
                PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .contentType(file.getContentType())
                        .build();

        s3Client.putObject(
                request,
                RequestBody.fromBytes(file.getBytes())
        );

        return CompletableFuture.completedFuture(key);
    }

    /*
    ============================================================
                        VIEW FILE
    ============================================================
     */

    @Override
    public ResponseEntity<InputStreamResource> viewFile(
            String key
    ) {

        GetObjectRequest request =
                GetObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .build();

        ResponseInputStream<GetObjectResponse> file =
                s3Client.getObject(request);

        String contentType =
                file.response().contentType();

        return ResponseEntity.ok()
                .contentType(
                        MediaType.parseMediaType(contentType)
                )
                .body(new InputStreamResource(file));
    }

    /*
    ============================================================
                        DOWNLOAD FILE
    ============================================================
     */

    @Override
    public ResponseEntity<InputStreamResource> downloadFile(
            String key
    ) {

        GetObjectRequest request =
                GetObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .build();

        ResponseInputStream<GetObjectResponse> file =
                s3Client.getObject(request);

        String contentType =
                file.response().contentType();

        String fileName =
                key.substring(
                        key.lastIndexOf("/") + 1
                );

        return ResponseEntity.ok()
                .contentType(
                        MediaType.parseMediaType(contentType)
                )
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + fileName + "\""
                )
                .body(new InputStreamResource(file));
    }

    /*
    ============================================================
                        DELETE FILE
    ============================================================
     */

    @Override
    public void deleteFile(
            String key
    ) {

        DeleteObjectRequest request =
                DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .build();

        s3Client.deleteObject(request);
    }
}