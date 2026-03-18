import { mockEnrollments } from "@/services/mockData";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";

const roster = mockEnrollments.filter((e) => e.status === "APPROVED" && [1, 2].includes(e.courseId));

const columns: Column<typeof roster[0]>[] = [
  { key: "studentName", label: "Student" },
  { key: "courseName", label: "Course" },
  { key: "courseCode", label: "Code" },
  { key: "enrolledAt", label: "Enrolled Date", searchable: false },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} />, searchable: false },
];

export default function Roster() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Student Roster</h1>
        <p className="text-muted-foreground">Students enrolled in your courses</p>
      </div>
      <DataTable data={roster} columns={columns} searchPlaceholder="Search students..." />
    </div>
  );
}
