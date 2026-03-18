import { mockEnrollments } from "@/services/mockData";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import type { Enrollment } from "@/types";

// Student view — show only student's enrollments (mock: studentId === 1)
const myEnrollments = mockEnrollments.filter((e) => e.studentId === 1);

const columns: Column<Enrollment>[] = [
  { key: "courseCode", label: "Code" },
  { key: "courseName", label: "Course" },
  { key: "enrolledAt", label: "Date", searchable: false },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} />, searchable: false },
];

export default function MyEnrollments() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Enrollments</h1>
        <p className="text-muted-foreground">Track your enrollment history and status</p>
      </div>
      <DataTable data={myEnrollments} columns={columns} searchPlaceholder="Search enrollments..." />
    </div>
  );
}
