package school.dto;

import lombok.Data;

@Data
public class CourseDto {
	 	private Long courseId;
	    private String courseCode;
	    private String courseName;
	    private String courseDesc;

	    private Long departmentId;
	    private String departmentName;

	    private Long teacherId;
	    private String teacherName;
}
