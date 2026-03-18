import { mockDepartments } from "@/services/mockData";
import { DataTable, type Column } from "@/components/DataTable";
import type { Department } from "@/types";

const columns: Column<Department>[] = [
  { key: "code", label: "Code" },
  { key: "name", label: "Department" },
  { key: "headOfDepartment", label: "Head of Dept" },
  { key: "totalStudents", label: "Students", searchable: false },
  { key: "totalTeachers", label: "Teachers", searchable: false },
  { key: "totalCourses", label: "Courses", searchable: false },
];

export default function DepartmentList() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Departments</h1>
        <p className="text-muted-foreground">University departments overview</p>
      </div>
      <DataTable data={mockDepartments} columns={columns} searchPlaceholder="Search departments..." />
    </div>
  );
}
