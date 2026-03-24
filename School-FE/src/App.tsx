import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

import LandingPage from "@/pages/LandingPage";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import DashboardRedirect from "@/pages/DashboardRedirect";
import AdminDashboard from "@/pages/dashboard/AdminDashboard";
import StudentDashboard from "@/pages/dashboard/StudentDashboard";
import TeacherManage from "@/pages/admin/TeacherManage";
import StudentListPage from "@/pages/admin/StudentListPage";
import StudentList from "@/pages/students/StudentList";
import StudentDetails from "@/pages/students/StudentDetails";
import StudentEdit from "@/pages/students/StudentEdit";
import CourseList from "@/pages/courses/CourseList";
import EnrollmentList from "@/pages/enrollments/EnrollmentList";
import TeacherList from "@/pages/teachers/TeacherList";
import DepartmentList from "@/pages/departments/DepartmentList";
import MyCourses from "@/pages/teacher/MyCourses";
import Roster from "@/pages/teacher/Roster";
import Grades from "@/pages/teacher/Grades";
import Attendance from "@/pages/teacher/Attendance";
import MyProfile from "@/pages/student/MyProfile";
import AvailableCourses from "@/pages/student/AvailableCourses";
import MyEnrollments from "@/pages/student/MyEnrollments";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<DashboardRedirect />} />

            {/* Admin-only routes */}
            <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/teachers" element={<TeacherManage />} />
                <Route path="/admin/students" element={<StudentListPage />} />
                <Route path="/students" element={<StudentList />} />
                <Route path="/students/:id" element={<StudentDetails />} />
                <Route path="/students/:id/edit" element={<StudentEdit />} />
                <Route path="/teachers" element={<TeacherList />} />
                <Route path="/courses" element={<CourseList />} />
                <Route path="/departments" element={<DepartmentList />} />
                <Route path="/enrollments" element={<EnrollmentList />} />
              </Route>
            </Route>

            {/* Teacher-only routes */}
            <Route element={<ProtectedRoute roles={["TEACHER"]} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/my-courses" element={<MyCourses />} />
                <Route path="/roster" element={<Roster />} />
                <Route path="/grades" element={<Grades />} />
                <Route path="/attendance" element={<Attendance />} />
              </Route>
            </Route>

            {/* Student-only routes */}
            <Route element={<ProtectedRoute roles={["STUDENT"]} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/student-dashboard" element={<StudentDashboard />} />
                <Route path="/my-profile" element={<MyProfile />} />
                <Route path="/available-courses" element={<AvailableCourses />} />
                <Route path="/my-enrollments" element={<MyEnrollments />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
