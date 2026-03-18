export type Role = "ADMIN" | "TEACHER" | "STUDENT";

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
}

export interface Student {
  id: number;
  userId: number;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  enrollmentDate: string;
  departmentId: number;
  departmentName: string;
}

export interface Teacher {
  id: number;
  userId: number;
  name: string;
  email: string;
  phone: string;
  departmentId: number;
  departmentName: string;
  specialization: string;
}

export interface Course {
  id: number;
  name: string;
  code: string;
  description: string;
  credits: number;
  capacity: number;
  enrolled: number;
  teacherId: number;
  teacherName: string;
  departmentId: number;
  departmentName: string;
  schedule: string;
}

export interface Enrollment {
  id: number;
  studentId: number;
  studentName: string;
  courseId: number;
  courseName: string;
  courseCode: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  enrolledAt: string;
  approvedBy?: string;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  headOfDepartment: string;
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalEnrollments: number;
}

export interface Grade {
  id: number;
  studentId: number;
  studentName: string;
  courseId: number;
  courseName: string;
  grade: string;
  score: number;
}

export interface AttendanceRecord {
  id: number;
  studentId: number;
  studentName: string;
  courseId: number;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE";
}
