package school.dto.course;

import lombok.Data;

@Data
public class CourseResponse {
	 	private Long courseId;
	    private String courseCode;
	    private String courseName;
	    private String courseDesc;

	    private Long departmentId;
	    private String departmentName;

	    private Long teacherId;
	    private String teacherName;
}
