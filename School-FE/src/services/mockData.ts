import type { User, Student, Teacher, Course, Enrollment, Department, DashboardStats, Grade, AttendanceRecord } from "@/types";

export const mockUsers: (User & { password: string })[] = [
  { id: 1, email: "admin@university.edu", password: "admin123", name: "Dr. Sarah Wilson", role: "ADMIN" },
  { id: 2, email: "teacher@university.edu", password: "teacher123", name: "Prof. James Miller", role: "TEACHER" },
  { id: 3, email: "student@university.edu", password: "student123", name: "Alex Johnson", role: "STUDENT" },
];

export const mockDepartments: Department[] = [
  { id: 1, name: "Computer Science", code: "CS", headOfDepartment: "Dr. Sarah Wilson", totalStudents: 120, totalTeachers: 15, totalCourses: 8 },
  { id: 2, name: "Mathematics", code: "MATH", headOfDepartment: "Dr. Emily Chen", totalStudents: 90, totalTeachers: 10, totalCourses: 6 },
  { id: 3, name: "Physics", code: "PHY", headOfDepartment: "Dr. Robert Brown", totalStudents: 75, totalTeachers: 8, totalCourses: 5 },
  { id: 4, name: "English Literature", code: "ENG", headOfDepartment: "Dr. Lisa Park", totalStudents: 60, totalTeachers: 7, totalCourses: 4 },
];

export const mockTeachers: Teacher[] = [
  { id: 1, userId: 2, name: "Prof. James Miller", email: "james.miller@university.edu", phone: "(555) 101-2001", departmentId: 1, departmentName: "Computer Science", specialization: "Artificial Intelligence" },
  { id: 2, userId: 5, name: "Dr. Emily Chen", email: "emily.chen@university.edu", phone: "(555) 101-2002", departmentId: 2, departmentName: "Mathematics", specialization: "Applied Mathematics" },
  { id: 3, userId: 6, name: "Dr. Robert Brown", email: "robert.brown@university.edu", phone: "(555) 101-2003", departmentId: 3, departmentName: "Physics", specialization: "Quantum Mechanics" },
  { id: 4, userId: 7, name: "Prof. Maria Garcia", email: "maria.garcia@university.edu", phone: "(555) 101-2004", departmentId: 1, departmentName: "Computer Science", specialization: "Data Science" },
];

export const mockStudents: Student[] = [
  { id: 1, userId: 3, name: "Alex Johnson", email: "alex.j@university.edu", phone: "(555) 201-3001", dateOfBirth: "2002-05-14", address: "123 Oak Street, Springfield", enrollmentDate: "2024-09-01", departmentId: 1, departmentName: "Computer Science" },
  { id: 2, userId: 8, name: "Sophia Williams", email: "sophia.w@university.edu", phone: "(555) 201-3002", dateOfBirth: "2003-01-22", address: "456 Maple Ave, Springfield", enrollmentDate: "2024-09-01", departmentId: 1, departmentName: "Computer Science" },
  { id: 3, userId: 9, name: "Liam Davis", email: "liam.d@university.edu", phone: "(555) 201-3003", dateOfBirth: "2002-11-08", address: "789 Pine Road, Springfield", enrollmentDate: "2024-09-01", departmentId: 2, departmentName: "Mathematics" },
  { id: 4, userId: 10, name: "Olivia Martinez", email: "olivia.m@university.edu", phone: "(555) 201-3004", dateOfBirth: "2003-07-19", address: "321 Elm Street, Springfield", enrollmentDate: "2025-01-15", departmentId: 3, departmentName: "Physics" },
  { id: 5, userId: 11, name: "Noah Anderson", email: "noah.a@university.edu", phone: "(555) 201-3005", dateOfBirth: "2002-03-30", address: "654 Cedar Lane, Springfield", enrollmentDate: "2025-01-15", departmentId: 2, departmentName: "Mathematics" },
  { id: 6, userId: 12, name: "Emma Thomas", email: "emma.t@university.edu", phone: "(555) 201-3006", dateOfBirth: "2003-09-12", address: "987 Birch Way, Springfield", enrollmentDate: "2024-09-01", departmentId: 4, departmentName: "English Literature" },
];

export const mockCourses: Course[] = [
  { id: 1, name: "Introduction to Programming", code: "CS101", description: "Fundamentals of programming using Python", credits: 3, capacity: 40, enrolled: 35, teacherId: 1, teacherName: "Prof. James Miller", departmentId: 1, departmentName: "Computer Science", schedule: "Mon/Wed 9:00-10:30" },
  { id: 2, name: "Data Structures & Algorithms", code: "CS201", description: "Advanced data structures and algorithm design", credits: 4, capacity: 30, enrolled: 28, teacherId: 1, teacherName: "Prof. James Miller", departmentId: 1, departmentName: "Computer Science", schedule: "Tue/Thu 11:00-12:30" },
  { id: 3, name: "Calculus I", code: "MATH101", description: "Introduction to differential and integral calculus", credits: 4, capacity: 50, enrolled: 42, teacherId: 2, teacherName: "Dr. Emily Chen", departmentId: 2, departmentName: "Mathematics", schedule: "Mon/Wed/Fri 10:00-11:00" },
  { id: 4, name: "Quantum Physics", code: "PHY301", description: "Introduction to quantum mechanics", credits: 3, capacity: 25, enrolled: 18, teacherId: 3, teacherName: "Dr. Robert Brown", departmentId: 3, departmentName: "Physics", schedule: "Tue/Thu 14:00-15:30" },
  { id: 5, name: "Machine Learning", code: "CS401", description: "Foundations of machine learning and AI", credits: 3, capacity: 35, enrolled: 33, teacherId: 4, teacherName: "Prof. Maria Garcia", departmentId: 1, departmentName: "Computer Science", schedule: "Wed/Fri 13:00-14:30" },
  { id: 6, name: "Linear Algebra", code: "MATH201", description: "Matrices, vector spaces, and linear transformations", credits: 3, capacity: 45, enrolled: 30, teacherId: 2, teacherName: "Dr. Emily Chen", departmentId: 2, departmentName: "Mathematics", schedule: "Mon/Wed 14:00-15:30" },
];

export const mockEnrollments: Enrollment[] = [
  { id: 1, studentId: 1, studentName: "Alex Johnson", courseId: 1, courseName: "Introduction to Programming", courseCode: "CS101", status: "APPROVED", enrolledAt: "2024-09-05", approvedBy: "Dr. Sarah Wilson" },
  { id: 2, studentId: 1, studentName: "Alex Johnson", courseId: 2, courseName: "Data Structures & Algorithms", courseCode: "CS201", status: "APPROVED", enrolledAt: "2024-09-05", approvedBy: "Dr. Sarah Wilson" },
  { id: 3, studentId: 2, studentName: "Sophia Williams", courseId: 1, courseName: "Introduction to Programming", courseCode: "CS101", status: "APPROVED", enrolledAt: "2024-09-06" },
  { id: 4, studentId: 3, studentName: "Liam Davis", courseId: 3, courseName: "Calculus I", courseCode: "MATH101", status: "PENDING", enrolledAt: "2025-01-20" },
  { id: 5, studentId: 4, studentName: "Olivia Martinez", courseId: 4, courseName: "Quantum Physics", courseCode: "PHY301", status: "PENDING", enrolledAt: "2025-02-01" },
  { id: 6, studentId: 1, studentName: "Alex Johnson", courseId: 5, courseName: "Machine Learning", courseCode: "CS401", status: "REJECTED", enrolledAt: "2025-01-25", approvedBy: "Prof. Maria Garcia" },
  { id: 7, studentId: 5, studentName: "Noah Anderson", courseId: 6, courseName: "Linear Algebra", courseCode: "MATH201", status: "APPROVED", enrolledAt: "2025-01-18" },
];

export const mockGrades: Grade[] = [
  { id: 1, studentId: 1, studentName: "Alex Johnson", courseId: 1, courseName: "Introduction to Programming", grade: "A", score: 95 },
  { id: 2, studentId: 1, studentName: "Alex Johnson", courseId: 2, courseName: "Data Structures & Algorithms", grade: "A-", score: 91 },
  { id: 3, studentId: 2, studentName: "Sophia Williams", courseId: 1, courseName: "Introduction to Programming", grade: "B+", score: 87 },
  { id: 4, studentId: 3, studentName: "Liam Davis", courseId: 3, courseName: "Calculus I", grade: "B", score: 83 },
];

export const mockAttendance: AttendanceRecord[] = [
  { id: 1, studentId: 1, studentName: "Alex Johnson", courseId: 1, date: "2025-02-10", status: "PRESENT" },
  { id: 2, studentId: 2, studentName: "Sophia Williams", courseId: 1, date: "2025-02-10", status: "PRESENT" },
  { id: 3, studentId: 1, studentName: "Alex Johnson", courseId: 1, date: "2025-02-08", status: "LATE" },
  { id: 4, studentId: 2, studentName: "Sophia Williams", courseId: 1, date: "2025-02-08", status: "ABSENT" },
  { id: 5, studentId: 1, studentName: "Alex Johnson", courseId: 2, date: "2025-02-10", status: "PRESENT" },
];

export const mockDashboardStats: DashboardStats = {
  totalStudents: mockStudents.length,
  totalTeachers: mockTeachers.length,
  totalCourses: mockCourses.length,
  totalEnrollments: mockEnrollments.length,
};
