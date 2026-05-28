import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, BookOpen, ArrowLeft, ChevronRight } from "lucide-react";
import ApiService from "@/api/ApiService";

interface Department {
  departmentId: number;
  departmentName: string;
  description: string;
  headOfDepartment: string;
  email: string;
}

interface Course {
  courseId: number;
  courseCode: string;
  courseName: string;
  courseDesc: string;
  teacherName: string;
}

const deptColors = [
  "from-yellow-400 to-orange-500",
  "from-orange-400 to-red-500",
  "from-amber-400 to-yellow-600",
  "from-yellow-500 to-amber-600",
  "from-orange-500 to-yellow-400",
  "from-red-400 to-orange-400",
];

export default function ExplorePage() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(false);

  useEffect(() => {
    ApiService.get("/api/departments")
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.content ?? res.data?.data ?? [];
        setDepartments(data);
      })
      .finally(() => setLoadingDepts(false));
  }, []);

  const handleDeptClick = (dept: Department) => {
    setSelectedDept(dept);
    setLoadingCourses(true);
    ApiService.get("/api/courses/course")
      .then((res) => {
        const all = Array.isArray(res.data)
          ? res.data
          : res.data?.content ?? res.data?.data ?? [];
        setCourses(all.filter((c: any) => c.departmentId === dept.departmentId));
      })
      .finally(() => setLoadingCourses(false));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFEF8] via-[#FFF7DA] to-[#FFE8AA] text-white">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-yellow-200 px-8 py-4 flex items-center gap-4">
        <button
          onClick={() => selectedDept ? setSelectedDept(null) : navigate("/")}
          className="flex items-center gap-2 text-orange-500 hover:text-orange-600 transition"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">{selectedDept ? "All Departments" : "Back to Home"}</span>
        </button>
        <div className="flex-1" />
        <h1 className="text-lg font-bold bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
          {selectedDept ? selectedDept.departmentName : "Explore Departments"}
        </h1>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-12">

        {/* Departments View */}
        {!selectedDept && (
          <>
            <div className="mb-10 text-center">
              <h2 className="text-4xl font-bold mb-3">
                Explore Our{" "}
                <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                  Departments
                </span>
              </h2>
              <p className="text-gray-500 text-lg">Click on a department to view available courses</p>
            </div>

            {loadingDepts ? (
              <div className="grid md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-48 rounded-3xl bg-white animate-pulse border border-yellow-100" />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {departments.map((dept, i) => (
                  <button
                    key={dept.departmentId}
                    onClick={() => handleDeptClick(dept)}
                    className="group text-left rounded-3xl border border-yellow-200 bg-white p-6 hover:bg-yellow-50 hover:border-yellow-400/50 hover:shadow-lg hover:shadow-yellow-500/10 hover:-translate-y-1 transition-all"
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${deptColors[i % deptColors.length]} flex items-center justify-center mb-4 shadow-lg`}>
                      <Building2 size={26} className="text-black" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{dept.departmentName}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{dept.description || "Explore courses in this department"}</p>
                    <div className="flex items-center gap-1 text-orange-500 text-sm font-medium group-hover:gap-2 transition-all">
                      View Courses <ChevronRight size={16} />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* Courses View */}
        {selectedDept && (
          <>
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 border border-yellow-200 text-orange-600 text-sm mb-4">
                <Building2 size={14} /> {selectedDept.departmentName}
              </div>
              <h2 className="text-3xl font-bold mb-2">Available Courses</h2>
              <p className="text-gray-500">
                {selectedDept.description || `Courses offered by ${selectedDept.departmentName}`}
              </p>
            </div>

            {loadingCourses ? (
              <div className="grid md:grid-cols-2 gap-5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-36 rounded-2xl bg-white animate-pulse border border-yellow-100" />
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen size={48} className="text-yellow-500/30 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No courses available for this department yet.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-5">
                {courses.map((course, i) => (
                  <div
                    key={course.courseId}
                    className="rounded-2xl border border-yellow-200 bg-white p-6 hover:bg-yellow-50 hover:border-yellow-400/40 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${deptColors[i % deptColors.length]} flex items-center justify-center shrink-0`}>
                        <BookOpen size={20} className="text-black" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-orange-500 bg-yellow-100 px-2 py-0.5 rounded-full">
                            {course.courseCode}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-gray-800 mb-1">{course.courseName}</h3>
                        <p className="text-sm text-gray-500 line-clamp-2">{course.courseDesc}</p>
                        {course.teacherName && (
                          <p className="text-xs text-yellow-500 mt-2">👨‍🏫 {course.teacherName}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
