package school.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import school.Enum.ResourceType;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SpecialCourseResource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long resourceId;

    @Column(nullable = false)
    private String title;

   
    @Column(nullable = false, unique = true, length = 2000)
    private String s3Key;

    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ResourceType resourceType;

    private Integer sequenceNo;

    private Boolean previewAllowed;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private SpecialCourse course;
}