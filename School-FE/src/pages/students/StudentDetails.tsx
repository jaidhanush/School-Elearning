import { useParams, useNavigate } from "react-router-dom";
import { mockStudents, mockEnrollments } from "@/services/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { ArrowLeft, Pencil } from "lucide-react";

export default function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const student = mockStudents.find((s) => s.id === Number(id));

  if (!student) return <p className="py-12 text-center text-muted-foreground">Student not found.</p>;

  const enrollments = mockEnrollments.filter((e) => e.studentId === student.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" /></Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{student.name}</h1>
          <p className="text-muted-foreground">{student.departmentName}</p>
        </div>
        <Button onClick={() => navigate(`/students/${student.id}/edit`)}><Pencil className="mr-2 h-4 w-4" />Edit</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">Personal Info</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{student.email}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span>{student.phone}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Date of Birth</span><span>{student.dateOfBirth}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Address</span><span>{student.address}</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Academic Info</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Student ID</span><span>STU-{String(student.id).padStart(4, "0")}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Department</span><span>{student.departmentName}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Enrollment Date</span><span>{student.enrollmentDate}</span></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Enrollments</CardTitle></CardHeader>
        <CardContent>
          {enrollments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No enrollments.</p>
          ) : (
            <div className="space-y-2">
              {enrollments.map((e) => (
                <div key={e.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{e.courseName}</p>
                    <p className="text-xs text-muted-foreground">{e.courseCode} · Enrolled {e.enrolledAt}</p>
                  </div>
                  <StatusBadge status={e.status} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
