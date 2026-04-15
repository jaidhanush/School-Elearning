import { useState, useEffect } from "react";
import ApiService from "@/api/ApiService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ConfirmModal } from "@/components/ConfirmModal";
import { Search, CheckCircle, XCircle, Clock } from "lucide-react";
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

export default function EnrollmentList() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; action: "APPROVED" | "REJECTED"; enrollment: Enrollment | null }>({
    open: false,
    action: "APPROVED",
    enrollment: null,
  });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchEnrollments = async () => {
    try {
      const res = await ApiService.get("/api/enrollments");
      setEnrollments(res.data || []);
    } catch {
      toast.error("Failed to load enrollments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleAction = async () => {
    if (!modal.enrollment) return;

    setActionLoading(true);
    try {
      await ApiService.put(`/api/enrollments/${modal.enrollment.enrollmentId}/${modal.action}`);
      
      toast.success(
        modal.action === "APPROVED" 
          ? `✓ Approved ${modal.enrollment.studentName}'s enrollment` 
          : `✗ Rejected ${modal.enrollment.studentName}'s enrollment`
      );
      
      await fetchEnrollments();
      setModal({ ...modal, open: false, enrollment: null });
    } catch (err: any) {
      const msg = ApiService.handleAxiosError(err, `Failed to ${modal.action.toLowerCase()} enrollment`);
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
      case "ACTIVE":
        return {
          color: "bg-green-50 border-green-200",
          badge: "bg-green-100 text-green-800",
          icon: <CheckCircle className="h-5 w-5 text-green-600" />,
          text: "Approved by Admin"
        };
      case "PENDING":
        return {
          color: "bg-yellow-50 border-yellow-200",
          badge: "bg-yellow-100 text-yellow-800",
          icon: <Clock className="h-5 w-5 text-yellow-600" />,
          text: "Awaiting Approval"
        };
      case "REJECTED":
        return {
          color: "bg-red-50 border-red-200",
          badge: "bg-red-100 text-red-800",
          icon: <XCircle className="h-5 w-5 text-red-600" />,
          text: "Rejected by Admin"
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

  const filtered = enrollments.filter(
    (e) =>
      e.studentName.toLowerCase().includes(search.toLowerCase()) ||
      e.courseName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return <div className="flex items-center justify-center h-40 text-muted-foreground">Loading enrollments...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Enrollments</h1>
        <p className="text-muted-foreground">Review and manage enrollment requests</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by student or course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">No enrollments found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filtered.map((e) => {
            const statusConfig = getStatusConfig(e.status);
            return (
              <Card key={e.enrollmentId} className={`border-2 ${statusConfig.color}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        {statusConfig.icon}
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{e.studentName}</h3>
                            <span className="text-muted-foreground">→</span>
                            <span className="font-medium">{e.courseName}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Enrolled on {new Date(e.enrollmentDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-8">
                        <Badge className={statusConfig.badge}>{statusConfig.text}</Badge>
                      </div>
                    </div>

                    {e.status?.toUpperCase() === "PENDING" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => setModal({ open: true, action: "APPROVED", enrollment: e })}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setModal({ open: true, action: "REJECTED", enrollment: e })}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <ConfirmModal
        open={modal.open}
        onOpenChange={(open) => setModal({ ...modal, open })}
        title={modal.action === "APPROVED" ? "Approve Enrollment" : "Reject Enrollment"}
        description={`Are you sure you want to ${modal.action.toLowerCase()} ${modal.enrollment?.studentName}'s enrollment in ${modal.enrollment?.courseName}?`}
        confirmLabel={actionLoading ? "Processing..." : modal.action === "APPROVED" ? "Approve" : "Reject"}
        variant={modal.action === "REJECTED" ? "destructive" : "default"}
        onConfirm={handleAction}
      />
    </div>
  );
}
