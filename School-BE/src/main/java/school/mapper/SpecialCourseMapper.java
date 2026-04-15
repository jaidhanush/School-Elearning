package school.mapper;

import org.springframework.stereotype.Component;

import school.dto.specialCourse.SpecialCourseRequest;
import school.dto.specialCourse.SpecialCourseResponse;
import school.models.Department;
import school.models.SpecialCourse;

@Component
public class SpecialCourseMapper {

    public SpecialCourse toSpecialCourse(SpecialCourseRequest request,Department dept) {
        SpecialCourse specialCourse = new SpecialCourse();


        specialCourse.setDepartment(dept);
        specialCourse.setCourseCode(request.getSpecialCourseCode());
        specialCourse.setCourseName(request.getSpecialCourseName());
        specialCourse.setCourseDesc(request.getSpecialCourseDesc());
        specialCourse.setAmount(request.getAmount());
        return specialCourse;
    }



    public SpecialCourseResponse toSpecialCourseResponse(SpecialCourse specialCourse) {
        SpecialCourseResponse response = new SpecialCourseResponse();
        response.setSpecialCourseId(specialCourse.getCourseId());
        response.setSpecialCourseCode(specialCourse.getCourseCode());
        response.setSpecialCourseName(specialCourse.getCourseName());
        response.setSpecialCourseDesc(specialCourse.getCourseDesc());
        response.setAmount(specialCourse.getAmount());

        if(specialCourse.getDepartment() != null)  {
             response.setDepartmentId(specialCourse.getDepartment().getDepartmentId());
             response.setDepartmentName(specialCourse.getDepartment().getDepartmentName());
        }
        
        if(specialCourse.getTeacher() != null) {        
        response.setTeacherId(specialCourse.getTeacher().getTeacherId());
        response.setTeacherName(specialCourse.getTeacher().getName());
        }
        return response;
    }

}
