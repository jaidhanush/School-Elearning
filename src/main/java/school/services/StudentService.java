package school.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import school.dto.EnrollmentDto;
import school.dto.StudentDto;
import school.mapper.EnrollmentMapper;
import school.mapper.StudentMapper;
import school.models.Course;
import school.models.Department;
import school.models.Enrollment;
import school.models.Students;
import school.repository.DepartmentRepo;
import school.repository.EnrollmentRepo;
import school.repository.StudentRepo;

@Service
@RequiredArgsConstructor
public class StudentService {

	private final StudentRepo studrepo;

	private final DepartmentRepo deptrepo;

	private final StudentMapper mapper;

	private final EnrollmentMapper enrollmapper;

	private final EnrollmentRepo enrollrepo;

	public List<StudentDto> getStudents()
	{
		return studrepo.findAll().stream().
				map(mapper::studDto).toList();
	}


	public StudentDto getStudent(long id) {
		Students student= studrepo.findById(id).orElseThrow(
				() -> new RuntimeException("Student not found with ID: " + id));
		return mapper.studDto(student);
	}

	public StudentDto putStudent(Students student, long stud_id) {
		 Students stud = studrepo.findById(stud_id)
		            .orElseThrow(() -> new RuntimeException("Student not found with ID: " + stud_id));

	
		    if (student.getFirstName() != null) stud.setFirstName(student.getFirstName());
		    if (student.getLastName() != null) stud.setLastName(student.getLastName());
		    if (student.getPhoneNumber() != null) stud.setPhoneNumber(student.getPhoneNumber());
		    if (student.getGender() != null) stud.setGender(student.getGender());

		    
		    if (student.getDepartment() != null && student.getDepartment().getDepartmentId() != null) {
		        Department dept = deptrepo.findById(student.getDepartment().getDepartmentId())
		                .orElseThrow(() -> new RuntimeException("Department not found!"));
		        stud.setDepartment(dept);
		    }

		     studrepo.save(stud);
		     return mapper.studDto(stud);
		
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
		 map.put("Student", mapper.studDto(stud));
		 
		 return map;
//		 System.out.println("Student with "+ stud_id +"deleted successfully");
		 
	}

	public List<EnrollmentDto> getEnrollments(long stud_id) {
		Students stud=studrepo.findById(stud_id).orElseThrow(
				() -> new RuntimeException("Student not found with ID: " + stud_id));
		
		return stud.getEnrollments().stream().map(enrollmapper::enrolltoDto).toList();
	}

	public List<Course> getAvailableCourses(long stud_id) {
		Students stud=studrepo.findById(stud_id).orElseThrow(
				() -> new RuntimeException("Student not found with ID: " + stud_id));
		
		List<Course> necourse= new ArrayList<>();
		
		List<Course> course=stud.getDepartment().getCourse();
		
		List<Enrollment> enroll=stud.getEnrollments();
		for(Enrollment en:enroll)
		{
			necourse.add(en.getCourse());
		}
		
		course.removeAll(necourse);
		
		return course;
	}

	public StudentDto RegisterStudent(Students stud) {
		stud.getUser().setRole("Student");
		 studrepo.save(stud);
		return mapper.studDto(stud);
		
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

	public StudentDto updateDepartment(long stud_id, long dept_id) {
		
		Department dept=deptrepo.findById(dept_id).orElseThrow(
				()->new RuntimeException("Department not found with ID: " + dept_id));
		
		Students stud=studrepo.findById(stud_id).orElseThrow(
				() -> new RuntimeException("Student not found with ID: " + stud_id));
		
		if(dept.getStudent().size()>=3) {
			throw new RuntimeException("Department is full ");
			
		}
		stud.setDepartment(dept);
		studrepo.save(stud);
		
		return mapper.studDto(stud);
	}

}
