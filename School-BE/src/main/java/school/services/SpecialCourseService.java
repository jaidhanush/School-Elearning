package school.services;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import school.dto.specialCourse.SpecialCourseRequest;
import school.dto.specialCourse.SpecialCourseResponse;
import school.dto.specialCourse.SpecialCourseUpdate;
import school.mapper.SpecialCourseMapper;
import school.models.Department;
import school.models.SpecialCourse;
import school.models.Teacher;
import school.repository.DepartmentRepo;
import school.repository.SpecialCourseRepo;
import school.repository.TeacherRepo;

@Service
@RequiredArgsConstructor
public class SpecialCourseService {

    private final SpecialCourseRepo specialCourseRepo;

    private final SpecialCourseMapper specialCourseMapper;

    private final DepartmentRepo departmentRepo;

    private final TeacherRepo teacherRepo;

    public List<SpecialCourseResponse> getSpecialCourse() {
       
      return specialCourseRepo.findAll().stream().map(specialCourseMapper::toSpecialCourseResponse).toList();

    }

    public SpecialCourseResponse getSpecialCourseById(Long id) {
       
        return specialCourseRepo.findById(id)
                .map(specialCourseMapper::toSpecialCourseResponse)
                .orElseThrow(() -> new RuntimeException("Special Course not found with id: " + id));
    }

    public SpecialCourseResponse createSpecialCourse(SpecialCourseRequest request, Long dep_id) {

      Department dept = departmentRepo.findById(dep_id).orElseThrow(() -> new RuntimeException("Department not found with id: " + dep_id));
        
        SpecialCourse specialCourse = specialCourseMapper.toSpecialCourse(request, dept);
        specialCourse = specialCourseRepo.save(specialCourse);
        return specialCourseMapper.toSpecialCourseResponse(specialCourse);
    }

    public SpecialCourseResponse updateSpecialCourse(Long id, SpecialCourseUpdate request) {
        SpecialCourse existingCourse = specialCourseRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Special Course not found with id: " + id));

        existingCourse.setCourseCode(request.getSpecialCourseCode());
        existingCourse.setCourseName(request.getSpecialCourseName());
        existingCourse.setCourseDesc(request.getSpecialCourseDesc());
        existingCourse.setAmount(request.getAmount());

        SpecialCourse updatedCourse = specialCourseRepo.save(existingCourse);
        return specialCourseMapper.toSpecialCourseResponse(updatedCourse);
    }

    public SpecialCourseResponse addTeacherToSpecialCourse(Long course_id, Long teacher_id) {
        SpecialCourse specialCourse = specialCourseRepo.findById(course_id)
                .orElseThrow(() -> new RuntimeException("Special Course not found with id: " + course_id));

        Teacher teacher = teacherRepo.findById(teacher_id)
                .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + teacher_id));

          if(specialCourse.getDepartment().getDepartmentId() != teacher.getDepartment().getDepartmentId()) {
            throw new RuntimeException("Teacher's department does not match the special course's department.");   
          }

        specialCourse.setTeacher(teacher);
        specialCourse = specialCourseRepo.save(specialCourse);
        return specialCourseMapper.toSpecialCourseResponse(specialCourse);
    }


    @Transactional
    public String deleteSpecialCourse(Long id) {



      SpecialCourse existingCourse = specialCourseRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Special Course not found with id: " + id));


                if(existingCourse.getResources().size() > 0) {
                    throw new RuntimeException("Cannot delete special course with associated resources. Please delete the resources first.");
                }


                specialCourseRepo.delete(existingCourse);

        return "Special Course " +  existingCourse.getCourseName() + " has been deleted.";
   
    }

}
