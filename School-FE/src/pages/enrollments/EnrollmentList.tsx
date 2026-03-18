import { useState } from "react";
import { mockEnrollments } from "@/services/mockData";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { ConfirmModal } from "@/components/ConfirmModal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Enrollment } from "@/types";

export default function EnrollmentList() {
  const [enrollments, setEnrollments] = useState(mockEnrollments);
  const [modal, setModal] = useState<{ open: boolean; action: "approve" | "reject"; id: number }>({ open: false, action: "approve", id: 0 });

  const handleAction = () => {
    setEnrollments((prev) =>
      prev.map((e) => (e.id === modal.id ? { ...e, status: modal.action === "approve" ? "APPROVED" : "REJECTED" } as Enrollment : e))
    );
    toast.success(`Enrollment ${modal.action === "approve" ? "approved" : "rejected"} (mock)`);
    setModal({ ...modal, open: false });
  };

  const columns: Column<Enrollment>[] = [
    { key: "studentName", label: "Student" },
    { key: "courseCode", label: "Code" },
    { key: "courseName", label: "Course" },
    { key: "enrolledAt", label: "Date", searchable: false },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} />, searchable: false },
    {
      key: "actions",
      label: "Actions",
      searchable: false,
      render: (r) =>
        r.status === "PENDING" ? (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="text-success" onClick={(e) => { e.stopPropagation(); setModal({ open: true, action: "approve", id: r.id }); }}>Approve</Button>
            <Button size="sm" variant="outline" className="text-destructive" onClick={(e) => { e.stopPropagation(); setModal({ open: true, action: "reject", id: r.id }); }}>Reject</Button>
          </div>
        ) : null,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Enrollments</h1>
        <p className="text-muted-foreground">Review and manage enrollment requests</p>
      </div>
      <DataTable data={enrollments} columns={columns} searchPlaceholder="Search enrollments..." />
      <ConfirmModal
        open={modal.open}
        onOpenChange={(open) => setModal({ ...modal, open })}
        title={modal.action === "approve" ? "Approve Enrollment" : "Reject Enrollment"}
        description={`Are you sure you want to ${modal.action} this enrollment?`}
        confirmLabel={modal.action === "approve" ? "Approve" : "Reject"}
        variant={modal.action === "reject" ? "destructive" : "default"}
        onConfirm={handleAction}
      />
    </div>
  );
}
