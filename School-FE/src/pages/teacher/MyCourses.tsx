import { mockCourses } from "@/services/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Users, Clock } from "lucide-react";

export default function MyCourses() {
  // Teacher sees their own courses (mock: teacherId === 1)
  const courses = mockCourses.filter((c) => c.teacherId === 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Courses</h1>
        <p className="text-muted-foreground">Courses you are currently teaching</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <Card key={c.id} className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-primary">{c.code}</span>
                <span className="text-xs text-muted-foreground">{c.credits} credits</span>
              </div>
              <CardTitle className="text-lg">{c.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />{c.schedule}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />{c.enrolled}/{c.capacity} students
              </div>
              <Progress value={(c.enrolled / c.capacity) * 100} className="h-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
