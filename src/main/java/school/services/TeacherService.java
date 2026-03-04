package school.services;


import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import school.dto.course.CourseResponse;
import school.dto.student.StudentResponse;
import school.dto.teacher.TeacherCreateRequest;
import school.dto.teacher.TeacherPatchRequest;
import school.dto.teacher.TeacherResponse;
import school.dto.teacher.TeacherUpdateRequest;
import school.mapper.CourseMapper;
import school.mapper.StudentMapper;
import school.mapper.TeacherMapper;
import school.models.Course;
import school.models.Department;
import school.models.Enrollment;
import school.models.Teacher;
import school.repository.DepartmentRepo;
import school.repository.TeacherRepo;


@Service
@RequiredArgsConstructor
public class TeacherService {

	private final TeacherRepo teachrepo;

	private final DepartmentRepo deptrepo;

	private final StudentMapper studentMapper;

	private final CourseMapper courseMapper;

	private final TeacherMapper teacherMapper;
	

	
	
	
	 public List<TeacherResponse> getAllTeachers() {
	     
		 return teachrepo.findAll().stream().map(teacherMapper::teacherResponse).toList();

	        
	    }

	    
	    public TeacherResponse getTeacherById(Long id) {
	        return teacherMapper.teacherResponse(teachrepo.findById(id)
	                .orElseThrow(() -> new RuntimeException("Teacher not found with ID: " + id)));
	        
	    }
	    
		public List<CourseResponse> getCourseByTeacher(Long id) {
			   Teacher teacher = teachrepo.findById(id)
		                .orElseThrow(() -> new RuntimeException("Teacher not found with ID: " + id));
			   
			  
			return   teacher.getCourse().stream().map(courseMapper::toCourseResponse).toList();
		}

		
		public List<StudentResponse> getStudentsByCourse(Long id, Long courseId) {
			
			Teacher teacher = teachrepo.findById(id)
	                .orElseThrow(() -> new RuntimeException("Teacher not found with ID: " + id));
			
			Course course = teacher.getCourse()
		            .stream()
		            .filter(c -> c.getCourseId().equals(courseId))
		            .findFirst()
		            .orElseThrow(() ->
		                    new RuntimeException("Course not assigned to this teacher"));

		    return course.getEnrollments()
		            .stream()
		            .map(Enrollment::getStudent)
		            .map(studentMapper::toStudentResponse)
		            .toList();
			
		}
		
		
		public TeacherResponse addTeacher(@Valid TeacherCreateRequest teacher) {

			 Department dept = deptrepo.findById(teacher.getDepartmentId())
		                .orElseThrow(() -> new RuntimeException("Department not found with ID: " + teacher.getDepartmentId()));

			Teacher teach =teacherMapper.toTeacherEntity(teacher);
			teach.setDepartment(dept);
			teach.getUser().setRole("TEACHER"); // Set role to TEACHER for any user created through this endpoint

	    	
	         teachrepo.save(teach); // User will be auto-saved
	         return teacherMapper.teacherResponse(teach); 
	    }
		
		
		public TeacherResponse updateTeacher(Long teach_id, TeacherUpdateRequest teacher) {
			
			Teacher teach = teachrepo.findById(teach_id)
	                .orElseThrow(() -> new RuntimeException("Teacher not found with ID: " + teach_id));

			Department dept = deptrepo.findById(teacher.getDepartmentId())
		                .orElseThrow(() -> new RuntimeException("Department not found with ID: " + teacher.getDepartmentId()));
			
			teach.setName(teacher.getName());
			teach.setGender(teacher.getGender());
			teach.setDepartment(dept);
			
			
			return teacherMapper.teacherResponse(teach);
		}
	
	

		public TeacherResponse teacherDeptAssaign(Long teach_id, Long dept_id) {
			
			Teacher teacher = teachrepo.findById(teach_id)
	                .orElseThrow(() -> new RuntimeException("Teacher not found with ID: " + teach_id));
			
			Department dept = deptrepo.findById(dept_id)
					.orElseThrow(() -> new RuntimeException("Department not found with ID: " + dept_id));
			
			teacher.setDepartment(dept);
			teachrepo.save(teacher);
			
			return teacherMapper.teacherResponse(teacher);
		}
		
		 // UPDATE teacher (only non-null fields)
	    public TeacherResponse patchTeacher(Long id, TeacherPatchRequest teacher) {
	        Teacher existingTeacher = teachrepo.findById(id)
	                .orElseThrow(() -> new RuntimeException("Teacher not found with ID: " + id));

	        // Update only non-null fields
	        if (teacher.getName() != null && !teacher.getName().isEmpty())
	            existingTeacher.setName(teacher.getName());
	        if (teacher.getGender() != null && !teacher.getGender().isEmpty())
	            existingTeacher.setGender(teacher.getGender());
			 if (teacher.getDepartmentId() != null) {						
				Department dept = deptrepo.findById(teacher.getDepartmentId())
	                .orElseThrow(() -> new RuntimeException("Department not found with ID: " + teacher.getDepartmentId()));						
	        existingTeacher.setDepartment(dept);
	        }
	        teachrepo.save(existingTeacher);
	        return teacherMapper.teacherResponse(existingTeacher);
	    }
	    

	    //  DELETE teacher
	    public Map<String,Object> deleteTeacher(Long id) {
	        Teacher teacher = teachrepo.findById(id)
	                .orElseThrow(() -> new RuntimeException("Teacher not found with ID: " + id));

			 if(deptrepo.existsByHeadOfDepartment_TeacherId(id)) {
        throw new RuntimeException("Cannot delete teacher because they are assigned as HOD to a department");
    }
	        
	        teachrepo.delete(teacher);
	        
	        Map<String,Object> map= new LinkedHashMap<>();
	        map.put("Teacher", teacherMapper.teacherResponse(teacher));
	        map.put("Msg", "Teacher id: "+id+" Deleted SUccessfully");
	        
	        return map;
	    }

		
	
	    





}
