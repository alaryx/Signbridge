import React, { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  MessageSquare,
  Upload,
  Plus,
  FileVideo,
  HardDrive,
  Trash2,
  Edit,
} from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview"); // overview, courses, modules, lessons

  // Data States
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersToday: 0,
    totalCourses: 0,
    totalLessons: 0,
    openQueries: 0,
  });
  const [queries, setQueries] = useState([]);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]); // if we fetch all lessons for the list
  const [loading, setLoading] = useState(true);

  // Form states
  const [uploadFile, setUploadFile] = useState(null);
  const [lessonData, setLessonData] = useState({
    title: "",
    description: "",
    type: "teach",
    duration: "1 min",
    courseId: "",
    moduleId: "",
  });
  const [newCourseName, setNewCourseName] = useState("");
  const [newModuleData, setNewModuleData] = useState({
    title: "",
    order: 1,
    courseId: "",
  });
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOverviewData();
    fetchCourses();
  }, []);

  // --- API Fetchers ---
  const fetchOverviewData = async () => {
    try {
      const [statsRes, queriesRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`),
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/queries`),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (queriesRes.ok) setQueries(await queriesRes.json());
    } catch (error) {
      console.error("Failed to fetch admin stats", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/learning/courses`,
      );
      const data = await res.json();
      if (data.status === "success") setCourses(data.data);
    } catch (error) {
      console.error("Failed to fetch courses", error);
    }
  };

  const fetchModules = async (courseId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/learning/courses/${courseId}/modules`,
      );
      const data = await res.json();
      if (data.status === "success") setModules(data.data);
      return data.data;
    } catch (error) {
      console.error("Failed to fetch modules", error);
      return [];
    }
  };

  const fetchAllModules = async () => {
    // Because the current API gets modules by course, we'll fetch them all by iterating courses
    let allMods = [];
    for (let c of courses) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/learning/courses/${c._id}/modules`,
        );
        const data = await res.json();
        if (data.status === "success") {
          allMods = [
            ...allMods,
            ...data.data.map((m) => ({ ...m, courseTitle: c.title })),
          ];
        }
      } catch (e) {}
    }
    setModules(allMods);
  };

  const fetchAllLessons = async () => {
    // We'll iterate through all courses and all modules to get a big flat list of lessons
    setLoading(true);
    let allLessons = [];
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/learning/curriculum`,
      );
      const data = await res.json();
      if (data.status === "success") {
        data.data.forEach((course) => {
          course.modules.forEach((mod) => {
            mod.lessons.forEach((l) => {
              allLessons.push({
                ...l,
                moduleTitle: mod.title,
                courseTitle: course.title,
              });
            });
          });
        });
        setLessons(allLessons);
      }
    } catch (error) {
      console.error("failed to get flat curriculum", error);
    }
    setLoading(false);
  };

  // React to tab changes to fetch required data
  useEffect(() => {
    if (activeTab === "courses") fetchCourses();
    if (activeTab === "modules") fetchAllModules();
    if (activeTab === "lessons") fetchAllLessons();
  }, [activeTab]);

  // --- Handlers ---
  const handleCourseChangeForUpload = (e) => {
    const courseId = e.target.value;
    setLessonData({ ...lessonData, courseId, moduleId: "" });
    setModules([]);
    if (courseId) fetchModules(courseId);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return setMessage("Please select a file to upload");

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("title", lessonData.title);
    formData.append("description", lessonData.description);
    formData.append("type", lessonData.type);
    formData.append("duration", lessonData.duration);
    formData.append("moduleId", lessonData.moduleId);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/lessons`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (res.ok) {
        setMessage("Lesson uploaded successfully!");
        setUploadFile(null);
        setLessonData({
          title: "",
          description: "",
          type: "teach",
          duration: "1 min",
          courseId: lessonData.courseId,
          moduleId: lessonData.moduleId,
        });
        fetchOverviewData();
      } else {
        const err = await res.json();
        setMessage(`Upload failed: ${err.message || "Unknown error"}`);
      }
    } catch (error) {
      setMessage("Network error during upload");
    } finally {
      setUploading(false);
    }
  };

  // --- CRUD API Calls ---
  const createCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/courses`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newCourseName,
            description: "Interactive Sign Language Course Level",
          }),
        },
      );
      if (res.ok) {
        setNewCourseName("");
        fetchCourses();
        alert("Course Created.");
      }
    } catch (error) {
      alert("Error creating course.");
    }
  };

  const deleteCourse = async (id) => {
    if (
      !window.confirm(
        "Delete this Course completely? (Cascade delete not enforced in UI test)",
      )
    )
      return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/courses/${id}`,
        { method: "DELETE" },
      );
      if (res.ok) fetchCourses();
    } catch (e) {
      alert("Failed to delete.");
    }
  };

  const createModule = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/modules`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newModuleData.title,
            courseId: newModuleData.courseId,
            order: Number(newModuleData.order),
          }),
        },
      );
      if (res.ok) {
        setNewModuleData({ title: "", order: 1, courseId: "" });
        fetchAllModules();
        alert("Module Created.");
      }
    } catch (error) {
      alert("Error creating module.");
    }
  };

  const deleteModule = async (id) => {
    if (!window.confirm("Delete this Module?")) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/modules/${id}`,
        { method: "DELETE" },
      );
      if (res.ok) fetchAllModules();
    } catch (e) {
      alert("Failed to delete.");
    }
  };

  const deleteLesson = async (id) => {
    if (
      !window.confirm(
        "Delete this Lesson? The file will also be destroyed in Cloudinary.",
      )
    )
      return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/lessons/${id}`,
        { method: "DELETE" },
      );
      if (res.ok) {
        alert("Deleted");
        fetchAllLessons();
      }
    } catch (e) {
      alert("Failed to delete.");
    }
  };

  if (loading && activeTab === "overview")
    return (
      <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Console</h1>
          <p className="text-gray-500 mt-1">
            Manage content, view metrics, and resolve queries.
          </p>
        </div>
        <div className="bg-brand-50 px-4 py-2 rounded-lg border border-brand-100 hidden sm:block">
          <span className="text-sm font-semibold text-brand-800">
            Admin Role Checked
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
        {["overview", "courses", "modules", "lessons"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg capitalize transition-all duration-200 ${
              activeTab === tab
                ? "bg-white text-brand-700 shadow border border-gray-100"
                : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: "Total Users",
                value: stats.totalUsers,
                icon: <Users size={24} />,
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                label: "Total Courses",
                value: stats.totalCourses,
                icon: <BookOpen size={24} />,
                color: "text-purple-600",
                bg: "bg-purple-50",
              },
              {
                label: "Total Lessons",
                value: stats.totalLessons,
                icon: <FileVideo size={24} />,
                color: "text-emerald-600",
                bg: "bg-emerald-50",
              },
              {
                label: "Open Queries",
                value: stats.openQueries,
                icon: <MessageSquare size={24} />,
                color: "text-amber-600",
                bg: "bg-amber-50",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4"
              >
                <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.label}
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* File Upload Section */}
            <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <Upload className="text-brand-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Upload New Lesson
                </h2>
              </div>
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lesson Title
                  </label>
                  <input
                    type="text"
                    required
                    value={lessonData.title}
                    onChange={(e) =>
                      setLessonData({ ...lessonData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                    placeholder="e.g. How to sign 'Hello'"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Action Description
                  </label>
                  <textarea
                    value={lessonData.description}
                    onChange={(e) =>
                      setLessonData({
                        ...lessonData,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 resize-none"
                    rows={3}
                    placeholder="Describe the sign action, e.g. 'Raise your open right hand to your forehead, palm outward, then bring it forward and down.'"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Course
                  </label>
                  <select
                    required
                    value={lessonData.courseId}
                    onChange={handleCourseChangeForUpload}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 bg-white"
                  >
                    <option value="" disabled>
                      -- Choose Course --
                    </option>
                    {courses.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Module
                  </label>
                  <select
                    required
                    value={lessonData.moduleId}
                    onChange={(e) =>
                      setLessonData({ ...lessonData, moduleId: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 bg-white"
                    disabled={!lessonData.courseId}
                  >
                    <option value="" disabled>
                      -- Choose Module --
                    </option>
                    {modules.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={lessonData.type}
                      onChange={(e) =>
                        setLessonData({ ...lessonData, type: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 bg-white"
                    >
                      <option value="teach">Teach</option>
                      <option value="practice">Practice</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={lessonData.duration}
                      onChange={(e) =>
                        setLessonData({
                          ...lessonData,
                          duration: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                      placeholder="e.g. 2 min"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Media File
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setUploadFile(e.target.files[0])}
                    accept="video/*, image/*"
                    className="text-sm"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-bold transition-colors"
                >
                  {uploading ? "Uploading..." : "Upload Lesson"}
                </button>
                {message && (
                  <p
                    className={`text-sm mt-2 ${message.includes("success") ? "text-green-600" : "text-red-600"}`}
                  >
                    {message}
                  </p>
                )}
              </form>
            </div>

            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MessageSquare className="text-brand-600" /> Recent Queries
              </h2>
              <div className="text-sm text-gray-500 italic">
                No queries API seeded fully yet.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: COURSES */}
      {activeTab === "courses" && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 border-l-4 border-brand-500 pl-3">
              Manage Levels (Courses)
            </h2>
            <form onSubmit={createCourse} className="flex gap-2">
              <input
                type="text"
                value={newCourseName}
                onChange={(e) => setNewCourseName(e.target.value)}
                placeholder="New Course Title (e.g. Level 3)"
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                required
              />
              <button
                type="submit"
                className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-brand-700"
              >
                <Plus size={16} /> Add
              </button>
            </form>
          </div>
          <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
            {courses.length === 0 ? (
              <p className="p-4 text-gray-500 text-sm">No courses found.</p>
            ) : (
              courses.map((c) => (
                <div
                  key={c._id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <span className="font-semibold text-gray-800">{c.title}</span>
                  <div className="flex gap-3">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500 font-mono">
                      {c._id}
                    </span>
                    <button
                      onClick={() => deleteCourse(c._id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: MODULES */}
      {activeTab === "modules" && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in duration-300">
          <div className="flex flex-col lg:flex-row justify-between lg:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold text-gray-900 border-l-4 border-purple-500 pl-3">
              Manage Modules
            </h2>
            <form onSubmit={createModule} className="flex flex-wrap gap-2">
              <select
                value={newModuleData.courseId}
                onChange={(e) =>
                  setNewModuleData({
                    ...newModuleData,
                    courseId: e.target.value,
                  })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                required
              >
                <option value="" disabled>
                  Select Parent Course
                </option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.title}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={newModuleData.title}
                onChange={(e) =>
                  setNewModuleData({ ...newModuleData, title: e.target.value })
                }
                placeholder="Module Title"
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-48"
                required
              />
              <input
                type="number"
                value={newModuleData.order}
                onChange={(e) =>
                  setNewModuleData({ ...newModuleData, order: e.target.value })
                }
                placeholder="Order"
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-20"
                required
                min="1"
              />
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-purple-700"
              >
                <Plus size={16} /> Add Module
              </button>
            </form>
          </div>
          <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
            {modules.length === 0 ? (
              <p className="p-4 text-gray-500 text-sm">
                No modules found or loading...
              </p>
            ) : (
              modules.map((m) => (
                <div
                  key={m._id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <div>
                    <span className="font-semibold text-gray-800">
                      {m.title}
                    </span>
                    <p className="text-xs text-purple-600 font-medium mt-0.5">
                      Parent Course: {m.courseTitle || m.courseId}
                    </p>
                  </div>
                  <div className="flex gap-3 items-center">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500 font-mono">
                      Order: {m.order}
                    </span>
                    <button
                      onClick={() => deleteModule(m._id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: LESSONS */}
      {activeTab === "lessons" && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-3">
              Manage Lessons
            </h2>
            <button
              onClick={() => setActiveTab("overview")}
              className="text-emerald-600 text-sm font-medium hover:underline"
            >
              Go to Overview to Upload (+)
            </button>
          </div>
          {loading ? (
            <p className="p-4 text-gray-500 text-sm">
              Organizing huge classroom... please wait.
            </p>
          ) : (
            <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
              {lessons.length === 0 ? (
                <p className="p-4 text-gray-500 text-sm">No lessons found.</p>
              ) : (
                lessons.map((l) => (
                  <div
                    key={l._id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      {l.mediaType === "video" ? (
                        <FileVideo className="text-emerald-500 w-8 h-8" />
                      ) : (
                        <HardDrive className="text-emerald-500 w-8 h-8" />
                      )}
                      <div>
                        <a
                          href={l.mediaUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-gray-800 hover:text-emerald-600 transition-colors"
                        >
                          {l.title}
                        </a>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">
                          {l.courseTitle} &rarr; {l.moduleTitle}{" "}
                          <span className="ml-2 bg-gray-200 px-1 py-0.5 rounded uppercase">
                            {l.type}
                          </span>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteLesson(l._id || l.id)}
                      className="text-red-500 hover:text-red-700 p-2 border border-transparent hover:border-red-100 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
