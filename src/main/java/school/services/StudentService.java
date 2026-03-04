package school.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import school.dto.course.CourseResponse;
import school.dto.enrollment.EnrollmentResponse;
import school.dto.student.StudentCreateRequest;
import school.dto.student.StudentPatchRequest;
import school.dto.student.StudentResponse;
import school.dto.student.StudentUpdateRequest;
import school.mapper.CourseMapper;
import school.mapper.EnrollmentMapper;
import school.mapper.StudentMapper;
import school.models.Department;
import school.models.Enrollment;
import school.models.Students;
import school.repository.DepartmentRepo;
import school.repository.EnrollmentRepo;
import school.repository.StudentRepo;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final CourseMapper courseMapper;

	private final StudentRepo studrepo;

	private final DepartmentRepo deptrepo;

	private final StudentMapper studentMapper;

	private final EnrollmentMapper enrollmapper;

	private final EnrollmentRepo enrollrepo;



	public List<StudentResponse> getStudents()
	{
		return studrepo.findAll().stream().
				map(studentMapper::toStudentResponse).toList();
	}


	public StudentResponse getStudent(long id) {
		Students student= studrepo.findById(id).orElseThrow(
				() -> new RuntimeException("Student not found with ID: " + id));
		return studentMapper.toStudentResponse(student);
	}
	
	
	public List<EnrollmentResponse> getEnrollments(long stud_id) {
		Students stud=studrepo.findById(stud_id).orElseThrow(
				() -> new RuntimeException("Student not found with ID: " + stud_id));
		
		return stud.getEnrollments().stream().map(enrollmapper::enrolltoDto).toList();
	}

	public List<CourseResponse> getAvailableCourses(long stud_id) {
		Students stud=studrepo.findById(stud_id).orElseThrow(
				() -> new RuntimeException("Student not found with ID: " + stud_id));
		
		
		Set<Long> enrolledCourseIds = stud.getEnrollments()
		        .stream()
		        .map(en -> en.getCourse().getCourseId())
		        .collect(Collectors.toSet());

		return stud.getDepartment()
		        .getCourse()
		        .stream()
		        .filter(course -> !enrolledCourseIds.contains(course.getCourseId()))
		        .map(courseMapper::toCourseResponse)
		        .toList();

	   
	}
	
	public StudentResponse RegisterStudent(StudentCreateRequest request) {

        Students student = studentMapper.toEntity(request);

        student.getUser().setRole("Student");

        Students savedStudent = studrepo.save(student);
        
        return studentMapper.toStudentResponse(savedStudent);
		
	}
	
	
	public StudentResponse updateStudent(Long stud_id, StudentUpdateRequest request) {

	    Students stud = studrepo.findById(stud_id)
	            .orElseThrow(() ->
	                    new RuntimeException("Student not found with ID: " + stud_id));

	    // Full update (PUT replaces values)
	    stud.setFirstName(request.getFirstName());
	    stud.setLastName(request.getLastName());
	    stud.setPhoneNumber(request.getPhoneNumber());
	    stud.setGender(request.getGender());

	    // No need to call save() because of Dirty Checking
	    studrepo.save(stud);
	    return studentMapper.toStudentResponse(stud);
	}
	
	

	public StudentResponse patchStudent(StudentPatchRequest student, long stud_id) {
		 Students stud = studrepo.findById(stud_id)
		            .orElseThrow(() -> new RuntimeException("Student not found with ID: " + stud_id));

	
		    if (student.getFirstName() != null) stud.setFirstName(student.getFirstName());
		    if (student.getLastName() != null) stud.setLastName(student.getLastName());
		    if (student.getPhoneNumber() != null) stud.setPhoneNumber(student.getPhoneNumber());
		    if (student.getGender() != null) stud.setGender(student.getGender());


		     studrepo.save(stud);
		     return studentMapper.toStudentResponse(stud);
		
	}
	
	
	public StudentResponse updateDepartment(long stud_id, long dept_id) {
		
		Department dept=deptrepo.findById(dept_id).orElseThrow(
				()->new RuntimeException("Department not found with ID: " + dept_id));
		
		Students stud=studrepo.findById(stud_id).orElseThrow(
				() -> new RuntimeException("Student not found with ID: " + stud_id));
		
		if(dept.getStudent().size()>=3) {
			throw new RuntimeException("Department is full ");
			
		}
		stud.setDepartment(dept);
		studrepo.save(stud);
		
		return studentMapper.toStudentResponse(stud);
	}

	public Map<String,Object> delStudent(long stud_id) {
		Students stud=studrepo.findById(stud_id).orElseThrow(
				() -> new RuntimeException("Student not found with ID: " + stud_id));
		
		if(stud.getEnrollments().stream().anyMatch(val->val.getStatus().equalsIgnoreCase("Enrolled")))
		{
			throw new RuntimeException("Cannot delete active student!");
		}
		
		 studrepo.delete(stud);
		 Map<String,Object> map=new HashMap<String,Object>();
		 
		 map.put("msg", "Student "+stud_id+" deleted Successfully");
		 map.put("Student", studentMapper.toStudentResponse(stud));
		 
		 return map;
//		 System.out.println("Student with "+ stud_id +"deleted successfully");
		 
	}



	

	public String delStudentEnroll(long enroll_id) {
		Enrollment enroll=enrollrepo.findById(enroll_id).orElseThrow(()-> new RuntimeException(" enrollment is not Found"));
		if(enroll.getStatus().equalsIgnoreCase("PENDING")) {
			enrollrepo.delete(enroll);
			return "enrollment Deleted Successfully";
		}else
		{
			throw new RuntimeException("Enrollment is Active can't Delete Now.");
		}
		 
	}

	

}
