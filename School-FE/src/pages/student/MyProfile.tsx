import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { mockStudents } from "@/services/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function MyProfile() {
  const { user } = useAuth();
  const student = mockStudents.find((s) => s.userId === user?.id) ?? mockStudents[0];
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ phone: student.phone, address: student.address });

  const handleSave = () => {
    toast.success("Profile updated (mock)");
    setEditing(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">View and manage your student profile</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">Personal Information</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span>{student.name}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{student.email}</span></div>
            {editing ? (
              <>
                <div className="space-y-1"><Label className="text-muted-foreground">Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                <div className="space-y-1"><Label className="text-muted-foreground">Address</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" onClick={handleSave}>Save</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span>{student.phone}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Address</span><span>{student.address}</span></div>
                <Button size="sm" variant="outline" onClick={() => setEditing(true)}>Edit Profile</Button>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Academic Details</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Student ID</span><span>STU-{String(student.id).padStart(4, "0")}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Department</span><span>{student.departmentName}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Date of Birth</span><span>{student.dateOfBirth}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Enrolled</span><span>{student.enrollmentDate}</span></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
