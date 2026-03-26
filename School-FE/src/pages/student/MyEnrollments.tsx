import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ApiService from "@/api/ApiService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";

interface Enrollment {
  enrollmentId: number;
  courseId: number;
  courseName: string;
  studentId: number;
  studentName: string;
  enrollmentDate: string;
  status: string;
  instructorApprovalStatus: string;
}

function getStudentId(email: string | undefined): number {
  if (!email) return 0;
  const stored = localStorage.getItem("user");
  if (stored) {
    const parsed = JSON.parse(stored);
    const id = Number(parsed.id);
    if (id > 0) return id;
  }
  return Number(localStorage.getItem(`studentId_${email}`)) || 0;
}

export default function MyEnrollments() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      const studentId = getStudentId(user?.email);
      if (!studentId) {
        setLoading(false);
        return;
      }

      try {
        const res = await ApiService.get(`/api/enrollments/student/${studentId}`);
        setEnrollments(res.data || []);
      } catch {
        setEnrollments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, [user?.email]);

  const getStatusConfig = (status: string) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
      case "ACTIVE":
        return {
          color: "bg-green-50 border-green-200",
          badge: "bg-green-100 text-green-800",
          icon: <CheckCircle className="h-5 w-5 text-green-600" />,
          text: "Approved by Instructor"
        };
      case "PENDING":
        return {
          color: "bg-yellow-50 border-yellow-200",
          badge: "bg-yellow-100 text-yellow-800",
          icon: <Clock className="h-5 w-5 text-yellow-600" />,
          text: "Awaiting Instructor Approval"
        };
      case "REJECTED":
        return {
          color: "bg-red-50 border-red-200",
          badge: "bg-red-100 text-red-800",
          icon: <XCircle className="h-5 w-5 text-red-600" />,
          text: "Rejected by Instructor"
        };
      default:
        return {
          color: "bg-gray-50 border-gray-200",
          badge: "bg-gray-100 text-gray-800",
          icon: null,
          text: status
        };
    }
  };

  if (loading)
    return <div className="flex items-center justify-center h-40 text-muted-foreground">Loading enrollments...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Enrollments</h1>
        <p className="text-muted-foreground">Track your enrollment history and status</p>
      </div>

      {enrollments.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">No enrollments found. Enroll in courses to see them here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {enrollments.map((e) => {
            const statusConfig = getStatusConfig(e.status);
            return (
              <Card key={e.enrollmentId} className={`border-2 ${statusConfig.color}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {statusConfig.icon}
                      <div className="space-y-2">
                        <CardTitle className="text-lg">{e.courseName}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Enrolled on {new Date(e.enrollmentDate).toLocaleDateString()}
                        </p>
                        <Badge className={statusConfig.badge}>
                          {statusConfig.text}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
