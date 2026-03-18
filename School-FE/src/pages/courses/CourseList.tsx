import { useState } from "react";
import { mockCourses } from "@/services/mockData";
import { DataTable, type Column } from "@/components/DataTable";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { Course } from "@/types";

const columns: Column<Course>[] = [
  { key: "code", label: "Code" },
  { key: "name", label: "Course Name" },
  { key: "teacherName", label: "Teacher" },
  { key: "credits", label: "Credits", searchable: false },
  { key: "schedule", label: "Schedule", searchable: false },
  {
    key: "capacity",
    label: "Capacity",
    searchable: false,
    render: (row) => (
      <div className="flex items-center gap-2">
        <Progress value={(row.enrolled / row.capacity) * 100} className="h-2 w-20" />
        <span className="text-xs text-muted-foreground">{row.enrolled}/{row.capacity}</span>
      </div>
    ),
  },
];

export default function CourseList() {
  const [courses] = useState(mockCourses);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", code: "", description: "", credits: "3", capacity: "30" });

  const handleCreate = () => {
    toast.success(`Course "${form.name}" created (mock)`);
    setDialogOpen(false);
    setForm({ name: "", code: "", description: "", credits: "3", capacity: "30" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Courses</h1>
          <p className="text-muted-foreground">Manage all courses</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Add Course</Button>
      </div>

      <DataTable data={courses} columns={columns} searchPlaceholder="Search courses..." />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Course</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Course Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Course Code</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Credits</Label><Input type="number" value={form.credits} onChange={(e) => setForm({ ...form, credits: e.target.value })} /></div>
              <div className="space-y-2"><Label>Capacity</Label><Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
