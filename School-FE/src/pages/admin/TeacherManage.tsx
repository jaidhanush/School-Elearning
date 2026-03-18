import { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import ApiService from "@/api/ApiService";

interface Teacher {
  teacherId: number;
  name: string;
  gender: string;
  userId: number;
  userMail: string;
  departmentId: number;
  departmentName: string;
}

const defaultForm = {
  name: "",
  gender: "",
  departmentId: "",
  email: "",
  password: "",
};

export default function TeacherManage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  const fetchTeachers = () => {
    setLoading(true);
    ApiService.get("/api/teachers/teacher")
      .then((res) => setTeachers(res.data))
      .catch(() => toast.error("Failed to load teachers"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      gender: form.gender,
      departmentId: Number(form.departmentId),
      user: { email: form.email, password: form.password },
    };
    console.log("ADD TEACHER PAYLOAD:", JSON.stringify(payload));
    try {
      await ApiService.post("/api/teachers/teacher", payload);
      toast.success("Teacher added successfully!");
      setForm(defaultForm);
      setShowForm(false);
      fetchTeachers();
    } catch {
      toast.error("Failed to add teacher");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await ApiService.delete(`/api/teachers/teacher/${id}`);
      toast.success("Teacher deleted");
      setTeachers((prev) => prev.filter((t) => t.teacherId !== id));
    } catch {
      toast.error("Failed to delete teacher");
    }
  };

  return (
    <div className="space-y-6 p-2">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-700 to-blue-500 px-8 py-7 text-white shadow-lg">
        <p className="text-xs font-medium uppercase tracking-widest text-blue-200 mb-1">
          Admin Panel
        </p>
        <h1 className="text-2xl font-bold">Teacher Management</h1>
        <p className="text-sm text-blue-100 mt-1">
          Add, view and delete teachers
        </p>
      </div>

      {/* Add Button */}
      <div className="flex justify-end">
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Teacher
        </Button>
      </div>

      {/* Add Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Add New Teacher</CardTitle>
              <button onClick={() => setShowForm(false)}>
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="space-y-1">
                  <Label>Name</Label>
                  <Input
                    placeholder="Full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label>Gender</Label>
                  <Select
                    value={form.gender}
                    onValueChange={(v) => setForm({ ...form, gender: v })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Department ID</Label>
                  <Input
                    type="text"
                    placeholder="e.g. 1"
                    value={form.departmentId}
                    onChange={(e) =>
                      setForm({ ...form, departmentId: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="teacher@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="flex-1" disabled={saving}>
                    {saving ? "Saving..." : "Add Teacher"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Teacher Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Teachers</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : teachers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No teachers found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-3 pr-4">#</th>
                    <th className="pb-3 pr-4">Name</th>
                    <th className="pb-3 pr-4">Gender</th>
                    <th className="pb-3 pr-4">Department</th>
                    <th className="pb-3 pr-4">Email</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((t, i) => (
                    <tr
                      key={t.teacherId}
                      className="border-b last:border-0 hover:bg-muted/40 transition-colors"
                    >
                      <td className="py-3 pr-4 text-muted-foreground">
                        {i + 1}
                      </td>
                      <td className="py-3 pr-4 font-medium">{t.name}</td>
                      <td className="py-3 pr-4">{t.gender}</td>
                      <td className="py-3 pr-4">
                        {t.departmentName ?? t.departmentId}
                      </td>
                      <td className="py-3 pr-4">{t.userMail ?? "-"}</td>
                      <td className="py-3">
                        <button
                          onClick={() => handleDelete(t.teacherId)}
                          className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
