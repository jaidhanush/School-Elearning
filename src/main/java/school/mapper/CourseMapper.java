package school.mapper;

import org.springframework.stereotype.Component;
import school.dto.CourseDto;
import school.models.Course;

@Component
public class CourseMapper {

    public CourseDto courseDto(Course course) {
        CourseDto courseDto = new CourseDto();
        courseDto.setCourseId(course.getCourseId());
        courseDto.setCourseCode(course.getCourseCode());
        courseDto.setCourseName(course.getCourseName());
        courseDto.setCourseDesc(course.getCourseDesc());

        if (course.getDepartment() != null) {
        	courseDto.setDepartmentId(course.getDepartment().getDepartmentId());
        	courseDto.setDepartmentName(course.getDepartment().getDepartmentName());
        }

        if (course.getTeacher() != null) {
        	courseDto.setTeacherId(course.getTeacher().getTeacherId());
        	courseDto.setTeacherName(course.getTeacher().getName());
        }
        return courseDto;
    }
}
