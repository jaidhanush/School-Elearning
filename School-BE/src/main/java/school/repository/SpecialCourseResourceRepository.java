package school.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import school.models.SpecialCourseResource;

@Repository
public interface SpecialCourseResourceRepository extends JpaRepository<SpecialCourseResource, Long> {

    List<SpecialCourseResource>
    findByCourseCourseIdOrderBySequenceNo(Long courseId);

    List<SpecialCourseResource> findByCourseCourseId(Long courseId);


}