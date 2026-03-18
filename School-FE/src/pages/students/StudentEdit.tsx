import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockStudents } from "@/services/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function StudentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const student = mockStudents.find((s) => s.id === Number(id));

  const [form, setForm] = useState({
    name: student?.name ?? "",
    email: student?.email ?? "",
    phone: student?.phone ?? "",
    address: student?.address ?? "",
  });

  if (!student) return <p className="py-12 text-center text-muted-foreground">Student not found.</p>;

  const handleSave = () => {
    toast.success("Student updated successfully (mock)");
    navigate(`/students/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" /></Button>
        <h1 className="text-2xl font-bold">Edit Student</h1>
      </div>
      <Card className="max-w-2xl">
        <CardHeader><CardTitle>Student Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {(["name", "email", "phone", "address"] as const).map((key) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key} className="capitalize">{key}</Label>
              <Input id={key} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave}>Save Changes</Button>
            <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
