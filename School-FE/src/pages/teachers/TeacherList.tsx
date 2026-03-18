import { mockTeachers } from "@/services/mockData";
import { DataTable, type Column } from "@/components/DataTable";
import type { Teacher } from "@/types";

const columns: Column<Teacher>[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone", searchable: false },
  { key: "departmentName", label: "Department" },
  { key: "specialization", label: "Specialization" },
];

export default function TeacherList() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Teachers</h1>
        <p className="text-muted-foreground">Manage faculty members</p>
      </div>
      <DataTable data={mockTeachers} columns={columns} searchPlaceholder="Search teachers..." />
    </div>
  );
}
