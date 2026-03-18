import { useState } from "react";
import { mockGrades } from "@/services/mockData";
import { DataTable, type Column } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { Grade } from "@/types";

export default function Grades() {
  const [grades, setGrades] = useState(mockGrades);
  const [editGrade, setEditGrade] = useState<Grade | null>(null);
  const [score, setScore] = useState("");
  const [grade, setGrade] = useState("");

  const columns: Column<Grade>[] = [
    { key: "studentName", label: "Student" },
    { key: "courseName", label: "Course" },
    { key: "grade", label: "Grade", searchable: false },
    { key: "score", label: "Score", searchable: false },
    {
      key: "actions",
      label: "",
      searchable: false,
      render: (r) => (
        <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setEditGrade(r); setScore(String(r.score)); setGrade(r.grade); }}>
          Edit
        </Button>
      ),
    },
  ];

  const handleSave = () => {
    if (!editGrade) return;
    setGrades((prev) => prev.map((g) => (g.id === editGrade.id ? { ...g, grade, score: Number(score) } : g)));
    toast.success("Grade updated (mock)");
    setEditGrade(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Grades</h1>
        <p className="text-muted-foreground">Manage student grades</p>
      </div>
      <DataTable data={grades} columns={columns} searchPlaceholder="Search grades..." />
      <Dialog open={!!editGrade} onOpenChange={(open) => !open && setEditGrade(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Grade — {editGrade?.studentName}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Grade</Label><Input value={grade} onChange={(e) => setGrade(e.target.value)} /></div>
            <div className="space-y-2"><Label>Score</Label><Input type="number" value={score} onChange={(e) => setScore(e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditGrade(null)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
