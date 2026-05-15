package school.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import school.dto.SpecialCourseResourse.SpecialCourseResourceResponseDTO;
import school.dto.course.CourseResponse;
import school.dto.enrollment.EnrollmentResponse;
import school.dto.specialCourse.SpecialCourseResponse;
import school.dto.student.StudentCreateRequest;
import school.dto.student.StudentPatchRequest;
import school.dto.student.StudentResponse;
import school.dto.student.StudentUpdateRequest;
import school.mapper.CourseMapper;
import school.mapper.EnrollmentMapper;
import school.mapper.SpecialCourseMapper;
import school.mapper.SpecialCourseResourceMapper;
import school.mapper.StudentMapper;
import school.models.Department;
import school.models.Enrollment;
import school.models.SpecialCourseResource;
import school.models.SpecialEnrollment;
import school.models.Students;
import school.repository.DepartmentRepo;
import school.repository.EnrollmentRepo;
import school.repository.SpecialCourseResourceRepository;
import school.repository.StudentRepo;
import school.security.SecurityUtil;
import school.storage.FileStorageService;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final SpecialCourseResourceMapper specialCourseResourceMapper;

    private final CourseMapper courseMapper;

	private final StudentRepo studrepo;

	private final DepartmentRepo deptrepo;

	private final StudentMapper studentMapper;

	private final EnrollmentMapper enrollmapper;

	private final EnrollmentRepo enrollrepo;

	private final SpecialCourseMapper specialCourseMapper;

	private final SpecialCourseResourceRepository specialCourseResourceRepo;

	private final FileStorageService fileStorageService;






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



	public List<CourseResponse> getAvailableCourses() {

		Long user_id = SecurityUtil.getCurrentUserId();


		Students stud=studrepo.findByUser_UserId(user_id).orElseThrow(
				() -> new RuntimeException("Student not found with ID: " + user_id));

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
        student.getUser().setRole("STUDENT");

        if (request.getDepartmentId() != null) {
            Department dept = deptrepo.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found with ID: " + request.getDepartmentId()));
            student.setDepartment(dept);
        }

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

	
		    if (student.getFirstName() != null && !student.getFirstName().isEmpty()) stud.setFirstName(student.getFirstName());
		    if (student.getLastName() != null && !student.getLastName().isEmpty()) stud.setLastName(student.getLastName());
		    if (student.getPhoneNumber() != null && !student.getPhoneNumber().isEmpty()) stud.setPhoneNumber(student.getPhoneNumber());
		    if (student.getGender() != null && !student.getGender().isEmpty()) stud.setGender(student.getGender());


		     studrepo.save(stud);
		     return studentMapper.toStudentResponse(stud);
		
	}
	
	
	public StudentResponse updateDepartment(long stud_id, long dept_id) {
		
		Department dept=deptrepo.findById(dept_id).orElseThrow(
				()->new RuntimeException("Department not found with ID: " + dept_id));
		
		Students stud=studrepo.findById(stud_id).orElseThrow(
				() -> new RuntimeException("Student not found with ID: " + stud_id));
		
		if(dept.getStudent().size()>=36) {
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


    public List<SpecialCourseResponse> getSpecialCourses(Long studentId) {
        Students student = studrepo.findById(studentId)
				.orElseThrow(() -> new RuntimeException("Student not found with ID: " + studentId));
		
			return student.getSpecialEnrollments()
            .stream()
            .filter(SpecialEnrollment::isPaid)
            .map(SpecialEnrollment::getCourse)
            .map(specialCourseMapper::toSpecialCourseResponse)
            .toList();
    }


	// public List<SpecialCourseResource> getSpecialCourseContent(Long specialCourse_Id) {
	// 	SpecialCourseResource specialCourseResources = specialCourseResourceRepo.findByCourseCourseId(specialCourse_Id)
	// 			.orElseThrow(() -> new RuntimeException("Special Course Resources not found for Course ID: " + specialCourse_Id));


	// 		InputStreamResource=fileStorageService.viewFile(specialCourseResources.getS3Key());




		
	// }

	

}
