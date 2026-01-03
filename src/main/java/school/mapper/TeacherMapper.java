package school.mapper;


import org.springframework.stereotype.Component;

import school.dto.TeacherDto;
import school.models.Teacher;

@Component
public class TeacherMapper {

    private final CourseMapper courseMapper;

    public TeacherMapper(CourseMapper courseMapper) {
        this.courseMapper = courseMapper;
    }

    public TeacherDto teacherdto(Teacher teacher) {
        TeacherDto dto = new TeacherDto();

        dto.setTeacherId(teacher.getTeacherId());
        dto.setName(teacher.getName());
        dto.setGender(teacher.getGender());

        if (teacher.getUser() != null) {
            dto.setUserId(teacher.getUser().getUserId());
            dto.setUserMail(teacher.getUser().getEmail());
        }

        if (teacher.getDepartment() != null) {
            dto.setDepartmentId(teacher.getDepartment().getDepartmentId());
            dto.setDepartmentName(teacher.getDepartment().getDepartmentName());
        }
     
        // 👇 Convert Teacher’s Course list to CourseDto list
//        if (teacher.getCourse() != null) {
//            dto.setCourses((
//                teacher.getCourse().stream()
//                        .map(courseMapper::courseDto)
//                        .toList()));;
//        }

        return dto;
    }

}
