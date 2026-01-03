package school.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import school.dto.CourseDto;
import school.dto.EnrollmentDto;
import school.mapper.CourseMapper;
import school.mapper.EnrollmentMapper;
import school.models.Course;
import school.models.Department;
import school.models.Enrollment;
import school.models.Students;
import school.models.Teacher;
import school.repository.CourseRepo;
import school.repository.DepartmentRepo;
import school.repository.TeacherRepo;

@Service
public class CourseService {
	
	@Autowired
	private CourseRepo courserepo;
	
	@Autowired
	private DepartmentRepo deptrepo;
	
	@Autowired
	private TeacherRepo teachrepo;
	
	@Autowired 
	private CourseMapper mapper;
	
	@Autowired 
	private EnrollmentMapper enrollmapper;
	
	
	
	

	public List<CourseDto> getCourse() 
	{
		List<Course> course=courserepo.findAll();
		List<CourseDto> coursedto=new ArrayList<>();
		for(Course cour:course)
		{
			coursedto.add(mapper.courseDto(cour));
		}
		return coursedto;
		
//		return courserepo.findAll()
//                .stream()
//                .map(mapper::courseDto)
//                .toList();
	}

	

	
	
	public CourseDto postCourse(Course course,long dep_id) 
	{
		Department dept=deptrepo.findById(dep_id).orElseThrow(()-> new RuntimeException("Department not found"));
		
		
		if(courserepo.existsByCourseCodeAndDepartment_DepartmentId(course.getCourseCode(), dep_id)){
		    throw new RuntimeException("Course code already exists!");
		}
		
		
			course.setDepartment(dept);
		
		
		 courserepo.save(course);
		 return mapper.courseDto(course);
	}
	

	public CourseDto getCoursebyId(long course_id) {
		
		Course course =courserepo.findById(course_id).orElseThrow(()-> new RuntimeException("Course not found with ID: " + course_id));
		return mapper.courseDto(course);
	}
	
	

	public CourseDto putCourse(long course_id,Course course) {
		 Course existingCourse = courserepo.findById(course_id)
	                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + course_id));

	        if (course.getCourseCode() != null)
	            existingCourse.setCourseCode(course.getCourseCode());
	        if (course.getCourseName() != null)
	            existingCourse.setCourseName(course.getCourseName());
	        if (course.getCourseDesc() != null)
	            existingCourse.setCourseDesc(course.getCourseDesc());

	    
	        if (course.getDepartment() != null && course.getDepartment().getDepartmentId() != null) {
	            Department dept = deptrepo.findById(course.getDepartment().getDepartmentId())
	                    .orElseThrow(() -> new RuntimeException("Department not found!"));
	            existingCourse.setDepartment(dept);
	        }

	      
	        if (course.getTeacher() != null && course.getTeacher().getTeacherId() != null) {
	            Teacher teacher = teachrepo.findById(course.getTeacher().getTeacherId())
	                    .orElseThrow(() -> new RuntimeException("Teacher not found!"));
	            existingCourse.setTeacher(teacher);
	        }
	        
	         courserepo.save(existingCourse);
	         return mapper.courseDto(existingCourse);
	}

	public Map<String,Object> DeleteCourse(long course_id) {
		Course existingCourse = courserepo.findById(course_id)
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + course_id));
		
		if(!existingCourse.getEnrollments().isEmpty()){
		    throw new RuntimeException("Course has enrollments; cannot delete");
		}
		
		Map<String,Object> map=new HashMap<String, Object>();
		
		courserepo.delete(existingCourse);
		map.put("Course",mapper.courseDto(existingCourse));
		map.put("msg", "Course Mentioned above Deleted Succcessfully");
		return map;
	}

	public List<Students> getStudentsbyCourse(long course_id) {
		
		Course existingCourse = courserepo.findById(course_id)
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + course_id));
		
		
		List<Enrollment> enrollment=existingCourse.getEnrollments();
		List<Students> student=new ArrayList<>();
		
		for(Enrollment enroll:enrollment)
		{
			student.add(enroll.getStudent());
		}
		
		return student;
	}
	
	public List<EnrollmentDto> getenrollmentbyCourse(long course_id) {
		
		Course course = courserepo.findById(course_id)
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + course_id));
		
		return course.getEnrollments().stream().map(enrollmapper::enrolltoDto).toList();
	}





	public CourseDto addTeachertoCourse(long course_id, long teach_id) {
		Course course = courserepo.findById(course_id)
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + course_id));
		
		Teacher teacher = teachrepo.findById(teach_id)
				.orElseThrow(() -> new RuntimeException("Course not found with ID: " + teach_id));
		
		course.setTeacher(teacher);
		courserepo.save(course);
		return mapper.courseDto(course);
	}
	
	
	
	
	

}
