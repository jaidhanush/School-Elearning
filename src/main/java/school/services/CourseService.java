package school.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import school.dto.course.CoursePatchRequest;
import school.dto.course.CourseResponse;
import school.dto.course.CourseUpdateRequest;
import school.dto.response.EnrollmentDto;
import school.dto.response.StudentDto;
import school.mapper.CourseMapper;
import school.mapper.EnrollmentMapper;
import school.mapper.StudentMapper;
import school.models.Course;
import school.models.Department;
import school.models.Teacher;
import school.repository.CourseRepo;
import school.repository.DepartmentRepo;
import school.repository.TeacherRepo;

@Service
@RequiredArgsConstructor
public class CourseService {

	private final CourseRepo courseRepo;

	private final DepartmentRepo deptrepo;

	private final TeacherRepo teacherRepo;

	private final CourseMapper courseMapper;
	
	private final EnrollmentMapper enrollmentMapper;
	
	private final StudentMapper studentMapper;
	
	
	
	

	public List<CourseResponse> getCourse() 
	{
		return courseRepo.findAll()
				.stream()
				.map(courseMapper :: toCourseResponse).toList();
      
	}

	
	public CourseResponse getCoursebyId(long course_id) {
			
			Course course =courseRepo.findById(course_id).orElseThrow(()-> new RuntimeException("Course not found with ID: " + course_id));
			return courseMapper.toCourseResponse(course);
		}
	
	
	public List<StudentDto> getStudentsbyCourse(long course_id) {
		
		Course existingCourse = courseRepo.findById(course_id)
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + course_id));
		
		
		return existingCourse.getEnrollments().stream().map(enroll ->studentMapper.studDto(enroll.getStudent())).toList();
		
//		List<Enrollment> enrollment=existingCourse.getEnrollments();
//		List<Students> student=new ArrayList<>();
//		
//		for(Enrollment enroll:enrollment)
//		{
//			student.add(enroll.getStudent());
//		}
		
//		return student;
	}
	
	

	public List<EnrollmentDto> getenrollmentbyCourse(long course_id) {
		
		Course course = courseRepo.findById(course_id)
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + course_id));
		
		return course.getEnrollments().stream().map(enrollmentMapper::enrolltoDto).toList();
	}

	
	
	public CourseResponse createCourse(Course course,long dep_id) 
	{
		Department dept=deptrepo.findById(dep_id).
				orElseThrow(()-> new RuntimeException("Department not found"));
		
		
		if(courseRepo.existsByCourseCodeAndDepartment_DepartmentId(course.getCourseCode(), dep_id)){
		    throw new RuntimeException("Course code already exists!");
		}
		
		
			course.setDepartment(dept);
		
		
			courseRepo.save(course);
		 return courseMapper.toCourseResponse(course);
	}
	

	public CourseResponse updateCourse(long courseId, CourseUpdateRequest course) {
		Course existingCourse = courseRepo.findById(courseId)
	            .orElseThrow(() ->
	                    new RuntimeException("Course not found with ID: " + courseId));

	    Department department = deptrepo.findById(course.getDepartmentId())
	            .orElseThrow(() ->
	                    new RuntimeException("Department not found"));

	    Teacher teacher = teacherRepo.findById(course.getTeacherId())
	            .orElseThrow(() ->
	                    new RuntimeException("Teacher not found"));

	    // Full update (NO null checks)
	    existingCourse.setCourseCode(course.getCourseCode());
	    existingCourse.setCourseName(course.getCourseName());
	    existingCourse.setCourseDesc(course.getCourseDesc());
	    existingCourse.setDepartment(department);
	    existingCourse.setTeacher(teacher);

	    courseRepo.save(existingCourse);

	    return courseMapper.toCourseResponse(existingCourse);
	}
	
	
	

	public CourseResponse patchCourse(long course_id,CoursePatchRequest course) {
		 Course existingCourse = courseRepo.findById(course_id)
	                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + course_id));

	        if (course.getCourseCode() != null)
	            existingCourse.setCourseCode(course.getCourseCode());
	        if (course.getCourseName() != null)
	            existingCourse.setCourseName(course.getCourseName());
	        if (course.getCourseDesc() != null)
	            existingCourse.setCourseDesc(course.getCourseDesc());

	    
	        if (course.getDepartmentId() != null) {
	            Department dept = deptrepo.findById(course.getDepartmentId())
	                    .orElseThrow(() -> new RuntimeException("Department not found!"));
	            existingCourse.setDepartment(dept);
	        }

	      
	        if (course.getTeacherId() != null) {
	            Teacher teacher = teacherRepo.findById(course.getTeacherId())
	                    .orElseThrow(() -> new RuntimeException("Teacher not found!"));
	            existingCourse.setTeacher(teacher);
	        }
	        
	        courseRepo.save(existingCourse);
	         return courseMapper.toCourseResponse(existingCourse);
	}

	public Map<String,Object> DeleteCourse(long course_id) {
		Course existingCourse = courseRepo.findById(course_id)
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + course_id));
		
		if(!existingCourse.getEnrollments().isEmpty()){
		    throw new RuntimeException("Course has enrollments; cannot delete");
		}
		
		Map<String,Object> map=new HashMap<String, Object>();
		
		courseRepo.delete(existingCourse);
		map.put("Course",courseMapper.toCourseResponse(existingCourse));
		map.put("msg", "Course Mentioned above Deleted Succcessfully");
		return map;
	}



	public CourseResponse addTeachertoCourse(long course_id, long teach_id) {
		Course course = courseRepo.findById(course_id)
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + course_id));
		
		Teacher teacher = teacherRepo.findById(teach_id)
				.orElseThrow(() -> new RuntimeException("Course not found with ID: " + teach_id));
		
		course.setTeacher(teacher);
		courseRepo.save(course);
		return courseMapper.toCourseResponse(course);
	}


	
	
	
	
	

}
