import { useState } from "react";
import { mockAttendance, mockCourses } from "@/services/mockData";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AttendanceRecord } from "@/types";

export default function Attendance() {
  const teacherCourses = mockCourses.filter((c) => c.teacherId === 1);
  const [selectedCourse, setSelectedCourse] = useState(String(teacherCourses[0]?.id ?? ""));

  const filtered = mockAttendance.filter((a) => a.courseId === Number(selectedCourse));

  const columns: Column<AttendanceRecord>[] = [
    { key: "studentName", label: "Student" },
    { key: "date", label: "Date", searchable: false },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} />, searchable: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Attendance</h1>
        <p className="text-muted-foreground">Track student attendance by course</p>
      </div>
      <Select value={selectedCourse} onValueChange={setSelectedCourse}>
        <SelectTrigger className="w-64"><SelectValue placeholder="Select course" /></SelectTrigger>
        <SelectContent>
          {teacherCourses.map((c) => (
            <SelectItem key={c.id} value={String(c.id)}>{c.code} — {c.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <DataTable data={filtered} columns={columns} searchPlaceholder="Search students..." />
    </div>
  );
}
