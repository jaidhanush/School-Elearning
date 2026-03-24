import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ApiService from "@/api/ApiService";

interface Department {
  departmentId: number;
  departmentName: string;
  description: string;
  headOfDepartment: string;
  email: string;
}

const defaultForm = { departmentName: "", description: "", email: "" };

export default function DepartmentList() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Department | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  const fetchDepartments = () => {
    setLoading(true);
    ApiService.get("/api/departments")
      .then((res) => setDepartments(res.data))
      .catch(() => toast.error("Failed to load departments"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDepartments(); }, []);

  const openAdd = () => { setEditTarget(null); setForm(defaultForm); setShowForm(true); };
  const openEdit = (d: Department) => {
    setEditTarget(d);
    setForm({ departmentName: d.departmentName, description: d.description, email: d.email });
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditTarget(null); setForm(defaultForm); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editTarget) {
        await ApiService.put(`/api/departments/${editTarget.departmentId}`, form);
        toast.success("Department updated successfully!");
      } else {
        await ApiService.post("/api/departments", form);
        toast.success("Department created successfully!");
      }
      closeForm();
      fetchDepartments();
    } catch {
      toast.error(editTarget ? "Failed to update department" : "Failed to create department");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await ApiService.delete(`/api/departments/${id}`);
      toast.success("Department deleted");
      setDepartments((prev) => prev.filter((d) => d.departmentId !== id));
    } catch {
      toast.error("Failed to delete department");
    }
  };

  return (
    <div className="space-y-6 p-2">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-orange-600 to-orange-400 px-8 py-7 text-white shadow-lg">
        <p className="text-xs font-medium uppercase tracking-widest text-orange-200 mb-1">Admin Panel</p>
        <h1 className="text-2xl font-bold">Departments</h1>
        <p className="text-sm text-orange-100 mt-1">Manage university departments</p>
      </div>

      {/* Add Button */}
      <div className="flex justify-end">
        <Button onClick={openAdd} className="gap-2">
          <Plus className="h-4 w-4" /> Add Department
        </Button>
      </div>

      {/* Add Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{editTarget ? "Edit Department" : "Add New Department"}</CardTitle>
              <button onClick={closeForm}>
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <Label>Department Name</Label>
                  <Input
                    placeholder="e.g. Computer Science"
                    value={form.departmentName}
                    onChange={(e) => setForm({ ...form, departmentName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label>Description</Label>
                  <Input
                    placeholder="Brief description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="dept@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="flex-1" disabled={saving}>
                    {saving ? "Saving..." : editTarget ? "Update Department" : "Create Department"}
                  </Button>
                  <Button type="button" variant="outline" onClick={closeForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Department Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">All Departments</CardTitle>
          <span className="text-xs text-muted-foreground">{departments.length} total</span>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : departments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No departments found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-3 pr-4">#</th>
                    <th className="pb-3 pr-4">ID</th>
                    <th className="pb-3 pr-4">Department Name</th>
                    <th className="pb-3 pr-4">Description</th>
                    <th className="pb-3 pr-4">Head of Dept</th>
                    <th className="pb-3 pr-4">Email</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((d, i) => (
                    <tr key={d.departmentId} className="border-b last:border-0 hover:bg-muted/40 transition-colors">
                      <td className="py-3 pr-4 text-muted-foreground">{i + 1}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{d.departmentId}</td>
                      <td className="py-3 pr-4 font-medium">{d.departmentName}</td>
                      <td className="py-3 pr-4">{d.description}</td>
                      <td className="py-3 pr-4">{d.headOfDepartment || "-"}</td>
                      <td className="py-3 pr-4">{d.email}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(d)}
                            className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 transition-colors"
                          >
                            <Pencil className="h-3 w-3" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(d.departmentId)}
                            className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" /> Delete
                          </button>
                        </div>
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
