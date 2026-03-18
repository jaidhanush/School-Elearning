package school.mapper;

import org.springframework.stereotype.Component;

import school.dto.course.CourseCreateRequest;
import school.dto.course.CourseResponse;
import school.models.Course;
import school.models.Department;


@Component
public class CourseMapper {

    public Course toEntity(CourseCreateRequest request, Department dept) {

        Course course = new Course();
        course.setCourseCode(request.getCourseCode());
        course.setCourseDesc(request.getCourseDesc());
        course.setCourseName(request.getCourseName());
        course.setDepartment(dept);

        return course;
    }

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
