import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Plus, Trash2, Pencil, X, Eye, ChevronDown, ChevronUp, FolderOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

interface Resource {
  resourceId: number;
  title: string;
  s3Key: string;
  resourceType: "VIDEO" | "IMAGE" | "PDF";
  sequenceNo: number;
  previewAllowed: boolean;
  courseId: number;
  courseName: string;
}

interface SpecialCourse {
  specialCourseId: number;
  specialCourseCode: string;
  specialCourseName: string;
  departmentName: string;
  amount: number;
}

export default function SpecialCourseResource() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [courses, setCourses] = useState<SpecialCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourseId, setExpandedCourseId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Resource | null>(null);
  const [activeCourseId, setActiveCourseId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [sequenceNo, setSequenceNo] = useState("");
  const [previewAllowed, setPreviewAllowed] = useState("false");
  const [file, setFile] = useState<File | null>(null);

  const fetchResources = () => {
    ApiService.get("/api/special-course-resources")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.content ?? res.data?.data ?? [];
        setResources(data);
      })
      .catch(() => toast.error("Failed to load resources"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    ApiService.get("/api/special-courses")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.content ?? res.data?.data ?? [];
        setCourses(data);
      })
      .catch(() => toast.error("Failed to load special courses"));
    fetchResources();
  }, []);

  const resetForm = () => {
    setTitle(""); setSequenceNo(""); setPreviewAllowed("false"); setFile(null); setFormError(null);
  };

  const openAdd = (courseId: number) => {
    setEditTarget(null);
    setActiveCourseId(courseId);
    resetForm();
    setShowForm(true);
  };

  const openEdit = (r: Resource) => {
    setEditTarget(r);
    setActiveCourseId(r.courseId);
    setTitle(r.title);
    setSequenceNo(String(r.sequenceNo));
    setPreviewAllowed(String(r.previewAllowed));
    setFile(null);
    setFormError(null);
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditTarget(null); setActiveCourseId(null); resetForm(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget && !file) return toast.error("Please select a file");
    setSaving(true);
    setFormError(null);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("previewAllowed", previewAllowed);
    if (sequenceNo) formData.append("sequenceNo", sequenceNo);
    if (file) formData.append("file", file);
    try {
      if (editTarget) {
        await ApiService.put(`/api/special-course-resources/${editTarget.resourceId}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Resource updated successfully!");
      } else {
        await ApiService.post(`/api/special-course-resources/course/${activeCourseId}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Resource uploaded successfully!");
      }
      closeForm();
      fetchResources();
    } catch (err: any) {
      setFormError(ApiService.handleAxiosError(err, "Failed to save resource"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await ApiService.delete(`/api/special-course-resources/${id}`);
      toast.success("Resource deleted");
      setResources((prev) => prev.filter((r) => r.resourceId !== id));
    } catch (err: any) {
      toast.error(ApiService.handleAxiosError(err, "Failed to delete resource"));
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleView = (resourceId: number) => {
    window.open(`http://localhost:8080/api/special-course-resources/view?resource_Id=${resourceId}`, "_blank");
  };

  const inputCls = "w-full rounded-md border border-input bg-amber-50 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:bg-white transition-colors";

  const typeBadge = (type: string) => {
    const map: Record<string, string> = {
      VIDEO: "bg-orange-100 text-orange-700",
      IMAGE: "bg-yellow-100 text-yellow-700",
      PDF: "bg-amber-100 text-amber-700",
    };
    return map[type] ?? "bg-gray-100 text-gray-600";
  };

  return (
    <div className="space-y-6 p-6 min-h-full bg-gradient-to-br from-[#FFFEF8] via-[#FFF7DA] to-[#FFE8AA]">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-7 text-black shadow-lg shadow-yellow-200">
        <p className="text-xs font-medium uppercase tracking-widest text-black/60 mb-1">Admin Panel</p>
        <h1 className="text-2xl font-bold">Special Course Resources</h1>
        <p className="text-sm text-black/70 mt-1">Manage resources for each special course</p>
      </div>

      {/* Course Cards */}
      {loading ? (
        <p className="text-sm text-gray-500 px-2">Loading...</p>
      ) : courses.length === 0 ? (
        <p className="text-sm text-gray-500 px-2">No special courses found.</p>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => {
            const courseResources = resources
              .filter((r) => r.courseId === course.specialCourseId)
              .sort((a, b) => a.sequenceNo - b.sequenceNo);
            const isExpanded = expandedCourseId === course.specialCourseId;

            return (
              <div key={course.specialCourseId} className="rounded-2xl border border-yellow-200 bg-white overflow-hidden shadow-sm">
                {/* Card Header — click to expand */}
                <button
                  onClick={() => setExpandedCourseId(isExpanded ? null : course.specialCourseId)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-yellow-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-300 to-orange-400 shadow">
                      <FolderOpen className="h-5 w-5 text-black" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{course.specialCourseName}</p>
                      <p className="text-xs text-gray-500">{course.specialCourseCode} · {course.departmentName} · ₹{course.amount}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 font-medium">{courseResources.length} resource{courseResources.length !== 1 ? "s" : ""}</span>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-orange-400" /> : <ChevronDown className="h-4 w-4 text-orange-400" />}
                  </div>
                </button>

                {/* Expanded Resources */}
                {isExpanded && (
                  <div className="border-t border-yellow-100 px-6 pb-6 pt-4">
                    <div className="flex justify-end mb-4">
                      <button
                        onClick={() => openAdd(course.specialCourseId)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-sm font-semibold hover:scale-105 transition"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Resource
                      </button>
                    </div>

                    {courseResources.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-4">No resources yet. Click "Add Resource" to upload one.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-yellow-200 text-left text-gray-500">
                              <th className="pb-3 pr-4">#</th>
                              <th className="pb-3 pr-4">ID</th>
                              <th className="pb-3 pr-4">Title</th>
                              <th className="pb-3 pr-4">Type</th>
                              <th className="pb-3 pr-4">Seq No</th>
                              <th className="pb-3 pr-4">Preview</th>
                              <th className="pb-3">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {courseResources.map((r, i) => (
                              <tr key={r.resourceId} className="border-b border-yellow-100 last:border-0 hover:bg-yellow-50 transition-colors">
                                <td className="py-3 pr-4 text-gray-500">{i + 1}</td>
                                <td className="py-3 pr-4 text-gray-500">{r.resourceId}</td>
                                <td className="py-3 pr-4 font-medium text-gray-800">{r.title}</td>
                                <td className="py-3 pr-4">
                                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${typeBadge(r.resourceType)}`}>
                                    {r.resourceType}
                                  </span>
                                </td>
                                <td className="py-3 pr-4 text-gray-600">{r.sequenceNo}</td>
                                <td className="py-3 pr-4">
                                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${r.previewAllowed ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                    {r.previewAllowed ? "Yes" : "No"}
                                  </span>
                                </td>
                                <td className="py-3">
                                  <div className="flex items-center gap-2">
                                    <button onClick={() => handleView(r.resourceId)} className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-200 transition-colors">
                                      <Eye className="h-3 w-3" /> View
                                    </button>
                                    <button onClick={() => openEdit(r)} className="inline-flex items-center gap-1 rounded-lg bg-yellow-100 px-3 py-1.5 text-xs font-medium text-orange-600 hover:bg-yellow-500/30 transition-colors">
                                      <Pencil className="h-3 w-3" /> Edit
                                    </button>
                                    <button onClick={() => setConfirmDeleteId(r.resourceId)} className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-500/30 transition-colors">
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
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Confirm Delete Dialog */}
      {confirmDeleteId !== null && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-gradient-to-br from-[#FFFEF8] via-[#FFF7DA] to-[#FFE8AA] border border-yellow-300 shadow-2xl p-6">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 shadow">
                <Trash2 className="h-5 w-5 text-black" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Delete Resource?</h3>
              <p className="text-sm text-gray-500">Are you sure you want to delete this resource? This action cannot be undone.</p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 rounded-xl border border-yellow-300 bg-white py-2 text-sm font-semibold text-gray-700 hover:bg-yellow-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId!)}
                className="flex-1 rounded-xl bg-gradient-to-r from-red-400 to-red-500 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      , document.body)}

      {/* Form Modal */}
      {showForm && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{editTarget ? "Edit Resource" : "Add New Resource"}</CardTitle>
              <button onClick={closeForm}><X className="h-5 w-5 text-muted-foreground" /></button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {formError && (
                  <div className="rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 border border-orange-300 px-4 py-3 text-sm text-orange-700 font-medium">
                    ⚠️ {formError}
                  </div>
                )}

                <div className="space-y-1">
                  <Label>Title <span className="text-red-500">*</span></Label>
                  <input placeholder="Resource title" value={title} onChange={(e) => setTitle(e.target.value)} required className={inputCls} />
                </div>

                <div className="space-y-1">
                  <Label>Sequence No</Label>
                  <input type="number" placeholder="e.g. 1" value={sequenceNo} onChange={(e) => setSequenceNo(e.target.value)} min="0" className={inputCls} />
                </div>

                <div className="space-y-1">
                  <Label>Preview Allowed <span className="text-red-500">*</span></Label>
                  <Select value={previewAllowed} onValueChange={setPreviewAllowed}>
                    <SelectTrigger className="bg-amber-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[10000]" position="popper" sideOffset={4}>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label>
                    {editTarget ? "Replace File (optional)" : "File"}
                    {!editTarget && <span className="text-red-500"> *</span>}
                  </Label>
                  <input
                    type="file"
                    accept="video/*,image/*,.pdf"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    required={!editTarget}
                    className="w-full rounded-md border border-input bg-amber-50 px-3 py-2 text-sm text-gray-600 outline-none focus:border-orange-400 transition-colors file:mr-3 file:rounded file:border-0 file:bg-orange-100 file:px-2 file:py-1 file:text-xs file:font-medium file:text-orange-700"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="flex-1" disabled={saving}>
                    {saving ? "Saving..." : editTarget ? "Update Resource" : "Upload Resource"}
                  </Button>
                  <Button type="button" variant="outline" onClick={closeForm}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      , document.body)}
    </div>
  );
}
