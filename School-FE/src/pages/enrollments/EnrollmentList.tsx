import { useState, useEffect } from "react";
import ApiService from "@/api/ApiService";
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
  const [modal, setModal] = useState<{ open: boolean; action: "APPROVED" | "REJECTED"; enrollment: Enrollment | null }>({ open: false, action: "APPROVED", enrollment: null });
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

  useEffect(() => { fetchEnrollments(); }, []);

  const handleAction = async () => {
    if (!modal.enrollment) return;
    setActionLoading(true);
    try {
      await ApiService.put(`/api/enrollments/${modal.enrollment.enrollmentId}/${modal.action}`);
      toast.success(modal.action === "APPROVED" ? `✓ Approved ${modal.enrollment.studentName}'s enrollment` : `✗ Rejected ${modal.enrollment.studentName}'s enrollment`);
      await fetchEnrollments();
      setModal({ ...modal, open: false, enrollment: null });
    } catch (err: any) {
      toast.error(ApiService.handleAxiosError(err, `Failed to ${modal.action.toLowerCase()} enrollment`));
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status?.toUpperCase()) {
      case "APPROVED": case "ACTIVE":
        return { border: "border-green-500/30 bg-green-500/10", badge: "bg-green-100 text-green-600", icon: <CheckCircle className="h-5 w-5 text-green-600" />, text: "Approved" };
      case "PENDING":
        return { border: "border-yellow-500/30 bg-yellow-500/10", badge: "bg-yellow-100 text-orange-500", icon: <Clock className="h-5 w-5 text-orange-500" />, text: "Pending" };
      case "REJECTED":
        return { border: "border-red-500/30 bg-red-500/10", badge: "bg-red-100 text-red-600", icon: <XCircle className="h-5 w-5 text-red-600" />, text: "Rejected" };
      default:
        return { border: "border-yellow-200 bg-white", badge: "bg-yellow-50 text-gray-500", icon: null, text: status };
    }
  };

  const filtered = enrollments.filter(
    (e) => e.studentName.toLowerCase().includes(search.toLowerCase()) || e.courseName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return <div className="flex items-center justify-center h-40 text-gray-500">Loading enrollments...</div>;

  return (
    <div className="space-y-6 p-6 min-h-full bg-gradient-to-br from-[#FFFEF8] via-[#FFF7DA] to-[#FFE8AA]">

      <div className="rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-7 text-black shadow-lg shadow-yellow-200">
        <p className="text-xs font-medium uppercase tracking-widest text-black/60 mb-1">Admin Panel</p>
        <h1 className="text-2xl font-bold">Enrollments</h1>
        <p className="text-sm text-black/70 mt-1">Review and manage enrollment requests</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-500" />
        <input
          placeholder="Search by student or course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-yellow-200 text-gray-800 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-yellow-200 bg-white flex items-center justify-center h-40">
          <p className="text-gray-500">No enrollments found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((e) => {
            const s = getStatusConfig(e.status);
            return (
              <div key={e.enrollmentId} className={`rounded-2xl border-2 ${s.border} p-5`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {s.icon}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-800">{e.studentName}</span>
                        <span className="text-gray-500">→</span>
                        <span className="font-medium text-gray-200">{e.courseName}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Enrolled on {new Date(e.enrollmentDate).toLocaleDateString()}</p>
                      <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${s.badge}`}>{s.text}</span>
                    </div>
                  </div>
                  {e.status?.toUpperCase() === "PENDING" && (
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => setModal({ open: true, action: "APPROVED", enrollment: e })} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-100 text-green-600 text-xs font-medium hover:bg-green-500/30 transition">
                        <CheckCircle className="h-3.5 w-3.5" /> Approve
                      </button>
                      <button onClick={() => setModal({ open: true, action: "REJECTED", enrollment: e })} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 text-red-600 text-xs font-medium hover:bg-red-500/30 transition">
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
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
