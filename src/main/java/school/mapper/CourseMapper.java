package school.mapper;

import org.springframework.stereotype.Component;

import school.dto.course.CourseResponse;
import school.models.Course;

@Component
public class CourseMapper {

    public CourseResponse toCourseResponse(Course course) {
        CourseResponse courseDto = new CourseResponse();
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
