package school.storage;

import java.io.IOException;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    String uploadFile(
            MultipartFile file,
            String folder
    ) throws IOException;

    ResponseEntity<InputStreamResource> viewFile(
            String key
    );

    ResponseEntity<InputStreamResource> downloadFile(
            String key
    );

    void deleteFile(
            String key
    );
}