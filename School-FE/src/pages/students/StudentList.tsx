import { useNavigate } from "react-router-dom";
import { mockStudents } from "@/services/mockData";
import { DataTable, type Column } from "@/components/DataTable";
import type { Student } from "@/types";
import { Badge } from "@/components/ui/badge";

const columns: Column<Student>[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone", searchable: false },
  { key: "departmentName", label: "Department" },
  { key: "enrollmentDate", label: "Enrolled", searchable: false },
];

export default function StudentList() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Students</h1>
        <p className="text-muted-foreground">Manage all enrolled students</p>
      </div>
      <DataTable
        data={mockStudents}
        columns={columns}
        searchPlaceholder="Search students..."
        onRowClick={(s) => navigate(`/students/${s.id}`)}
      />
    </div>
  );
}
