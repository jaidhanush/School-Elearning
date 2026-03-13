package school.mapper;


import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import school.dto.teacher.TeacherCreateRequest;
import school.dto.teacher.TeacherResponse;
import school.models.Teacher;
import school.models.Users;

@Component
@RequiredArgsConstructor
public class TeacherMapper {
	
     private final PasswordEncoder encoder;
	
	
	public Teacher toTeacherEntity(TeacherCreateRequest request)
	{
		Users user = new Users();
		user.setEmail(request.getUser().getEmail());
		user.setPassword(encoder.encode(request.getUser().getPassword()));
		
		
		Teacher teacher =  new Teacher();
		teacher.setName(request.getName());
		teacher.setGender(request.getGender());

        teacher.setUser(user); 
		
		return teacher;
		
	}

    

    public TeacherResponse teacherResponse(Teacher teacher) {
        TeacherResponse dto = new TeacherResponse();

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
