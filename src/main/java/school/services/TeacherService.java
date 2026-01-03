package school.services;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.validation.Valid;
import school.dto.CourseDto;
import school.dto.StudentDto;
import school.dto.TeacherDto;
import school.mapper.CourseMapper;
import school.mapper.StudentMapper;
import school.mapper.TeacherMapper;
import school.models.Course;
import school.models.Department;
import school.models.Enrollment;
import school.models.Students;
import school.models.Teacher;
import school.repository.DepartmentRepo;
import school.repository.TeacherRepo;
import school.repository.UserRepository;

@Service
public class TeacherService {
	
	@Autowired
	private TeacherRepo teachrepo;
	
	@Autowired
	private DepartmentRepo deptrepo;
	
	@Autowired
	private UserRepository userrepo;
	
	@Autowired
	private StudentMapper studmapper;
	
	@Autowired
	private CourseMapper coursemapper;
	
	@Autowired
	private TeacherMapper mapper;
	
	 public List<TeacherDto> getAllTeachers() {
	     
		 return teachrepo.findAll().stream().map(mapper::teacherdto).toList();

	        
	    }

	    // ✅ GET teacher by ID
	    public TeacherDto getTeacherById(Long id) {
	        return mapper.teacherdto(teachrepo.findById(id)
	                .orElseThrow(() -> new RuntimeException("Teacher not found with ID: " + id)));
	        
	    }

	    // ✅ UPDATE teacher (only non-null fields)
	    public TeacherDto updateTeacher(Long id, Teacher teacher) {
	        Teacher existingTeacher = teachrepo.findById(id)
	                .orElseThrow(() -> new RuntimeException("Teacher not found with ID: " + id));

	        // Update only non-null fields
	        if (teacher.getName() != null)
	            existingTeacher.setName(teacher.getName());
	        if (teacher.getGender() != null)
	            existingTeacher.setGender(teacher.getGender());

	        // Update department (if provided)
	        if (teacher.getDepartment() != null && teacher.getDepartment().getDepartmentId() != null) {
	            Department dept = deptrepo.findById(teacher.getDepartment().getDepartmentId())
	                    .orElseThrow(() -> new RuntimeException("Department not found!"));
	            existingTeacher.setDepartment(dept);
	        }

	        teachrepo.save(existingTeacher);
	        return mapper.teacherdto(existingTeacher);
	    }

	    // ✅ DELETE teacher
	    public Map<String,Object> deleteTeacher(Long id) {
	        Teacher teacher = teachrepo.findById(id)
	                .orElseThrow(() -> new RuntimeException("Teacher not found with ID: " + id));
	        
	        teachrepo.delete(teacher);
	        
	        Map<String,Object> map= new LinkedHashMap<>();
	        map.put("Teacher", mapper.teacherdto(teacher));
	        map.put("Msg", "Teacher id: "+id+" Deleted SUccessfully");
	        
	        return map;
	    }
	
	
	    public TeacherDto postTeacher(@Valid Teacher teacher) {
//	        Department department = deptrepo.findById(dep_id)
//	            .orElseThrow(() -> new RuntimeException("Department not found with ID: " + dep_id));
//	        
//	        teacher.setDepartment(department)
	         teachrepo.save(teacher); // User will be auto-saved
	         return mapper.teacherdto(teacher);
	    }


	public List<CourseDto> getCourseByTeacher(Long id) {
		   Teacher teacher = teachrepo.findById(id)
	                .orElseThrow(() -> new RuntimeException("Teacher not found with ID: " + id));
		   
		  
		return   teacher.getCourse().stream().map(coursemapper::courseDto).toList();
	}

	public List<StudentDto> getStudentsByCourse(Long id, Long courseId) {
		
		Teacher teacher = teachrepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Teacher not found with ID: " + id));
		
		List<Course> course=teacher.getCourse();
		
		List<Students> stud=new ArrayList<>();
		for(Course cor:course)
		{
			if(cor.getCourseId()==courseId)
			{
				List<Enrollment> enroll=cor.getEnrollments();
				for(Enrollment en:enroll)
				{
					stud.add(en.getStudent());
				}
			}
			
		}
		return stud.stream().map(studmapper::studDto).toList();
//		teacher.getCourse().get(0).getEnrollments().get(0).getStudent();
		
	}

	public TeacherDto teacherDeptAssaign(Long teach_id, Long dept_id) {
		
		Teacher teacher = teachrepo.findById(teach_id)
                .orElseThrow(() -> new RuntimeException("Teacher not found with ID: " + teach_id));
		
		Department dept = deptrepo.findById(dept_id)
				.orElseThrow(() -> new RuntimeException("Teacher not found with ID: " + dept_id));
		
		teacher.setDepartment(dept);
		teachrepo.save(teacher);
		
		return mapper.teacherdto(teacher);
	}

}
