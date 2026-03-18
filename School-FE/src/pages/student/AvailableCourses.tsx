import { useState } from "react";
import { mockCourses, mockEnrollments } from "@/services/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Search, Clock, Users } from "lucide-react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ConfirmModal";

export default function AvailableCourses() {
  const [search, setSearch] = useState("");
  const [enrollModal, setEnrollModal] = useState<number | null>(null);

  const enrolledCourseIds = mockEnrollments.filter((e) => e.studentId === 1 && e.status !== "REJECTED").map((e) => e.courseId);

  const filtered = mockCourses.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleEnroll = () => {
    toast.success("Enrollment request submitted (mock)");
    setEnrollModal(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Available Courses</h1>
        <p className="text-muted-foreground">Browse and enroll in courses</p>
      </div>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => {
          const isEnrolled = enrolledCourseIds.includes(c.id);
          return (
            <Card key={c.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-primary">{c.code}</span>
                  <span className="text-xs text-muted-foreground">{c.credits} credits</span>
                </div>
                <CardTitle className="text-lg">{c.name}</CardTitle>
                <p className="text-xs text-muted-foreground">{c.teacherName}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{c.description}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4" />{c.schedule}</div>
                <div className="flex items-center gap-2 text-sm"><Users className="h-4 w-4 text-muted-foreground" /><span>{c.enrolled}/{c.capacity}</span></div>
                <Progress value={(c.enrolled / c.capacity) * 100} className="h-2" />
                <Button className="w-full" disabled={isEnrolled || c.enrolled >= c.capacity} onClick={() => setEnrollModal(c.id)}>
                  {isEnrolled ? "Already Enrolled" : c.enrolled >= c.capacity ? "Full" : "Enroll"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <ConfirmModal
        open={enrollModal !== null}
        onOpenChange={(open) => !open && setEnrollModal(null)}
        title="Confirm Enrollment"
        description={`Enroll in ${mockCourses.find((c) => c.id === enrollModal)?.name ?? "this course"}?`}
        confirmLabel="Enroll"
        onConfirm={handleEnroll}
      />
    </div>
  );
}
