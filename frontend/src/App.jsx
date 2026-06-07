/*
UX4G Government Design System Integration

1. Add UX4G CDN in index.html inside <head>
<link href="https://cdn.ux4g.gov.in/UX4G@2.0.8/css/ux4g-min.css" rel="stylesheet">

2. Add UX4G JS before closing body tag
<script src="https://cdn.ux4g.gov.in/UX4G@2.0.8/js/ux4g.min.js"></script>

UX4G Docs:
https://doc.ux4g.gov.in/
*/

import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
export default function ControlRoomFrontend() {
  const [formData, setFormData] = useState({
  name: "",
  mobile: "",
  epicNumber: "",
  district: "",
  category: "",
  description: "",
});
const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(
    complaints.map((complaint) => ({
      ComplaintID: complaint.complaintId,
      Name: complaint.name,
      Mobile: complaint.mobile,
      District: complaint.district,
      Category: complaint.category,
      Status: complaint.status,
      Date: new Date(
        complaint.createdAt
      ).toLocaleDateString(),
    }))
  );

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Complaints"
  );

  XLSX.writeFile(
    workbook,
    "complaints.xlsx"
  );
};
const [isLoggedIn, setIsLoggedIn] = useState(
  localStorage.getItem("isLoggedIn") === "true"
);

const [loginData, setLoginData] = useState({
  username: "",
  password: "",
});
const [selectedFile, setSelectedFile] = useState(null);
  const [activePage, setActivePage] = useState("home");

const [complaints, setComplaints] = useState([]);

const [trackingId, setTrackingId] = useState("");
const [trackingResult, setTrackingResult] = useState(null);
const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("All");


const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const data = new FormData();

    data.append("name", formData.name);
    data.append("mobile", formData.mobile);
    data.append("epicNumber", formData.epicNumber);
    data.append("district", formData.district);
    data.append("category", formData.category);
    data.append("description", formData.description);

    if (selectedFile) {
      data.append("document", selectedFile);
    }

    const response = await axios.post(
      "https://sir-control-room-backend.onrender.com/api/complaints",
      data
    );

    alert("Complaint Submitted Successfully");

    console.log(response.data);

    setFormData({
      name: "",
      mobile: "",
      epicNumber: "",
      district: "",
      category: "",
      description: "",
    });

  } catch (error) {
    console.log(error);
    alert("Error submitting complaint");
  }
};
const updateStatus = async (id) => {
  try {
    await axios.put(
      `https://sir-control-room-backend.onrender.com/api/complaints/${id}`,
      {
        status: "Resolved",
      }
    );

    fetchComplaints();
  } catch (error) {
    console.log(error);
  }
};

const trackComplaint = async () => {
  try {
    const response = await axios.get(
      `https://sir-control-room-backend.onrender.com/api/complaints/track/${trackingId}`
    );

    setTrackingResult(response.data);
  } catch (error) {
    alert("Complaint not found");
    setTrackingResult(null);
  }
};
useEffect(() => {
  fetchComplaints();
}, []);

const fetchComplaints = async () => {
  try {
   const response = await axios.get(
  "https://sir-control-room-backend.onrender.com/api/complaints"
);
    

    setComplaints(response.data);
  } catch (error) {
    console.log(error);
  }
};
const categories = [
    "Voter Name Issues",
    "EPIC / Voter ID Issues",
    "Address / Booth Issues",
    "BLO Related Issues",
    "Data Entry Issues",
    "Claim & Objection",
    "Document Upload Issues",
    "Technical Issues",
    "Helpline Related Issues",
  ];

  const menuItems = [
    "home",
    "about",
    "complaint",
    "status",
    "guidelines",
    "faq",
    "contact",
    "dashboard",
  ];
  const handleLogin = async (e) => {
  e.preventDefault();
  

  try {
    const response = await axios.post(
      "https://sir-control-room-backend.onrender.com/api/admin/login",
      loginData
    );

    alert(response.data.message);

    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");

  } catch (error) {
    alert("Invalid Credentials");
  }
};
const handleLogout = () => {
  localStorage.removeItem("isLoggedIn");
  setIsLoggedIn(false);
};

  const renderPage = () => {
    switch (activePage) {
      case "about":
        return <AboutPage />;
      case "complaint":
        return (
 <ComplaintPage
  categories={categories}
  formData={formData}
  handleChange={handleChange}
  handleSubmit={handleSubmit}
  setSelectedFile={setSelectedFile}
/>
);
      case "status":
  return (
    <StatusPage
      trackingId={trackingId}
      setTrackingId={setTrackingId}
      trackingResult={trackingResult}
      trackComplaint={trackComplaint}
    />
  );
      case "guidelines":
        return <GuidelinesPage />;
      case "faq":
        return <FAQPage />;
      case "contact":
        return <ContactPage />;
      case "dashboard":
  return isLoggedIn ? (
  <DashboardPage
  complaints={complaints}
  updateStatus={updateStatus}
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  statusFilter={statusFilter}
  setStatusFilter={setStatusFilter}
  handleLogout={handleLogout}
  exportToExcel={exportToExcel}
/>
  ) : (
    <LoginPage
      loginData={loginData}
      setLoginData={setLoginData}
      handleLogin={handleLogin}
    />
  );
      default:
        return <HomePage categories={categories} setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen bg-light font-sans">
      <header className="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-4 gap-4">
          <div>
            <h1 className="text-2xl font-bold">CONTROL ROOM SYSTEM</h1>
            <p className="text-sm text-blue-100">
              Special Intensive Revision (SIR)
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm">Helpline Number</p>
              <h2 className="text-2xl font-bold">1950</h2>
            </div>

            <button className="bg-white text-blue-900 px-4 py-2 rounded-xl font-semibold hover:bg-blue-100 transition">
              Emergency Support
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-white shadow-sm border-bottom sticky top-[88px] z-40 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-6 py-3 flex gap-6 min-w-max">
          {menuItems.map((item) => (
            <button
              key={item}
              onClick={() => setActivePage(item)}
              className={`capitalize font-medium transition ${
                activePage === item
                  ? "text-blue-700 border-b-2 border-blue-700"
                  : "text-slate-700 hover:text-blue-700"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </nav>

      {renderPage()}

      <footer className="bg-blue-950 text-white mt-16">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold">Control Room</h3>
            <p className="text-blue-100 mt-4">
              Public grievance redressal and voter assistance platform.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-blue-100">
              <li>Home</li>
              <li>Complaint</li>
              <li>Status</li>
              <li>FAQ</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Services</h4>
            <ul className="space-y-2 text-blue-100">
              <li>Complaint Management</li>
              <li>Voter Verification</li>
              <li>BLO Monitoring</li>
              <li>Technical Support</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-2 text-blue-100">
              <li>☎ 1950</li>
              <li>✉ support@sircontrolroom.gov.in</li>
              <li>📍 Election Control Room</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-900 py-4 text-center text-blue-200 text-sm">
          © 2025 Control Room System. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function HomePage({ categories, setActivePage }) {
  return (
    <>
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
              DIGITAL ELECTION SUPPORT SYSTEM
            </span>

            <h2 className="text-5xl font-bold text-slate-800 mt-6 leading-tight">
              SIR Control Room Help Desk
            </h2>

            <p className="mt-6 text-slate-600 text-lg leading-relaxed">
              Submit complaints, track requests, verify voter information,
              and access public grievance services online.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={() => setActivePage("complaint")}
                className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-semibold shadow"
              >
                File Complaint
              </button>

              <button
                onClick={() => setActivePage("status")}
                className="border border-blue-700 text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50"
              >
                Track Status
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="grid grid-cols-2 gap-4">
              <StatCard title="Total Complaints" value="1,248" color="blue" />
              <StatCard title="Pending" value="342" color="yellow" />
              <StatCard title="Resolved" value="286" color="green" />
              <StatCard title="Escalated" value="36" color="red" />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">
              Complaint Categories
            </h2>
            <p className="text-slate-500 mt-2">
              Select your issue category.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 shadow hover:shadow-xl transition"
            >
              <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center text-xl font-bold">
                {index + 1}
              </div>

              <h3 className="text-xl font-bold text-slate-800 mt-5">
                {category}
              </h3>

              <p className="text-slate-500 mt-3">
                Submit and track complaints related to this category.
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function ComplaintPage({
  categories,
  formData,
  handleChange,
  handleSubmit,
  setSelectedFile,
}) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-4xl font-bold text-slate-800 mb-8">
            File a Complaint
          </h2>
<form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
  type="text"
  name="name"
  value={formData.name}
  onChange={handleChange}
  placeholder="Enter your full name"
  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
/>
            <input
  type="text"
  name="mobile"
  value={formData.mobile}
  onChange={handleChange}
  placeholder="Enter mobile number"
  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
/>
            <input
  type="text"
  name="epicNumber"
  value={formData.epicNumber}
  onChange={handleChange}
  placeholder="Enter EPIC number"
  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
/>
           <input
  type="text"
  name="district"
  value={formData.district}
  onChange={handleChange}
  placeholder="Enter district"
  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
/>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Complaint Category
            </label>

            <select
  name="category"
  value={formData.category}
  onChange={handleChange}
  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
>
  <option value="">Select Category</option>

  {categories.map((category, index) => (
    <option key={index} value={category}>
      {category}
    </option>
  ))}
</select>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Complaint Description
            </label>

            <textarea
  rows={6}
  name="description"
  value={formData.description}
  onChange={handleChange}
  placeholder="Describe your issue in detail"
  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
></textarea>
          </div>

          <div className="mt-6 border-2 border-dashed border-slate-300 rounded-2xl p-8 bg-slate-50 text-center">
            <p className="text-slate-500">
              Upload supporting documents here.
            </p>
          </div>

          <div className="mt-8 flex justify-end">
            <div className="mt-4">
  <label className="block text-sm font-semibold mb-2">
    Upload Document (PDF, JPG, PNG)
  </label>

  <input
  type="file"
  onChange={(e) => setSelectedFile(e.target.files[0])}
  className="w-full border border-slate-300 rounded-xl px-4 py-3"
/>
</div>
           <button
  type="submit"
  className="bg-blue-700 text-white px-8 py-3 rounded-xl"
>
  Submit Complaint
</button>
          </div>
          </form>
        </div>

        <div className="space-y-6">
          <InfoCard />
          <HelpCard />
        </div>
      </div>
    </section>
  );
}

function StatusPage({
  trackingId,
  setTrackingId,
  trackingResult,
  trackComplaint,
}) {
  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <div className="bg-white rounded-3xl shadow-lg p-10">
        <h2 className="text-4xl font-bold text-slate-800 text-center">
          Track Complaint Status
        </h2>

        <p className="text-center text-slate-500 mt-4">
          Enter your complaint ID to check current status.
        </p>

        <div className="mt-10 flex flex-col md:flex-row gap-4">
          <input
  type="text"
  value={trackingId}
  onChange={(e) => setTrackingId(e.target.value)}
  placeholder="Enter Complaint ID"
  className="flex-1 border border-slate-300 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
/>

          <button
  onClick={trackComplaint}
  className="bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-800"
>
  Check Status
</button>
        </div>
{trackingResult && (
  <div className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-6">
    <h3 className="text-xl font-bold mb-4">
      Complaint Details
    </h3>

    <p><strong>ID:</strong> {trackingResult.complaintId}</p>
    <p><strong>Name:</strong> {trackingResult.name}</p>
    <p><strong>Category:</strong> {trackingResult.category}</p>
    <p><strong>Status:</strong> {trackingResult.status}</p>
  </div>
)}
        <div className="mt-10 bg-slate-50 rounded-2xl p-6 border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800">
            Complaint Timeline
          </h3>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              "Submitted",
              "Assigned",
              "Verification",
              "Resolved",
            ].map((step, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 text-center shadow-sm"
              >
                <div className="w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center mx-auto font-bold">
                  {idx + 1}
                </div>
                <p className="mt-4 font-semibold text-slate-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutPage() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="bg-white rounded-3xl shadow-lg p-10">
        <h2 className="text-4xl font-bold text-slate-800">
          About SIR Control Room
        </h2>

        <p className="mt-6 text-slate-600 leading-relaxed text-lg">
          The SIR Control Room is a digital grievance redressal platform for
          election support, voter verification, complaint management, BLO
          monitoring, and Special Intensive Revision services.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <FeatureCard title="24×7 Support" icon="☎️" />
          <FeatureCard title="Complaint Tracking" icon="📋" />
          <FeatureCard title="Real-Time Dashboard" icon="📊" />
        </div>
      </div>
    </section>
  );
}

function GuidelinesPage() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="bg-white rounded-3xl shadow-lg p-10">
        <h2 className="text-4xl font-bold text-slate-800">Guidelines</h2>

        <div className="mt-8 space-y-6">
          {[
            "Provide accurate voter details.",
            "Upload valid documents only.",
            "Keep complaint acknowledgment safe.",
            "Avoid duplicate complaint submissions.",
          ].map((guide, idx) => (
            <div
              key={idx}
              className="bg-blue-50 border border-blue-100 rounded-2xl p-5"
            >
              <p className="text-slate-700 font-medium">✔ {guide}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQPage() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <div className="bg-white rounded-3xl shadow-lg p-10">
        <h2 className="text-4xl font-bold text-slate-800">FAQs</h2>

        <div className="mt-10 space-y-5">
          {[
            {
              q: "How do I file a complaint?",
              a: "Use the complaint form and submit required details.",
            },
            {
              q: "How can I track my complaint?",
              a: "Use complaint ID in the Track Status section.",
            },
            {
              q: "What documents are required?",
              a: "EPIC, Aadhaar, or address proof may be required.",
            },
          ].map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-200 rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-slate-800">
                {faq.q}
              </h3>
              <p className="text-slate-600 mt-3">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactPage() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <div className="bg-white rounded-3xl shadow-lg p-10">
        <h2 className="text-4xl font-bold text-slate-800">Contact Us</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <FeatureCard title="Helpline 1950" icon="☎️" />
          <FeatureCard title="support@sir.gov.in" icon="✉️" />
          <FeatureCard title="Election Control Room" icon="📍" />
        </div>
      </div>
    </section>
  );
}

function DashboardPage({
  complaints,
  updateStatus,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  handleLogout,
  exportToExcel,
}) {
  const pendingCount = complaints.filter(
  (c) => c.status === "Pending"
).length;

const resolvedCount = complaints.filter(
  (c) => c.status === "Resolved"
).length;

const escalatedCount = complaints.filter(
  (c) => c.status === "Escalated"
).length;
const chartData = [
  {
    name: "Pending",
    value: pendingCount,
  },
  {
    name: "Resolved",
    value: resolvedCount,
  },
  {
    name: "Escalated",
    value: escalatedCount,
  },
];
const categoryData = {};

complaints.forEach((complaint) => {
  if (categoryData[complaint.category]) {
    categoryData[complaint.category]++;
  } else {
    categoryData[complaint.category] = 1;
  }
});

const categoryChartData = Object.keys(
  categoryData
).map((key) => ({
  category: key,
  count: categoryData[key],
}));

const COLORS = [
  "#facc15",
  "#22c55e",
  "#ef4444",
];
const filteredComplaints = complaints.filter((complaint) => {
  const matchesSearch =
    complaint.complaintId
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||

    complaint.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||

    complaint.mobile
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

  const matchesStatus =
    statusFilter === "All" ||
    complaint.status === statusFilter;

  return matchesSearch && matchesStatus;
});

return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
       <StatCard
  title="Total Complaints"
  value={complaints.length}
  color="blue"
/>
        <StatCard
  title="Pending"
  value={pendingCount}
  color="yellow"
/>
        <StatCard
  title="Resolved"
  value={resolvedCount}
  color="green"
/>
        <StatCard
  title="Escalated"
  value={escalatedCount}
  color="red"
/>
      </div>

      <div className="mt-10 bg-white rounded-3xl shadow-lg p-8 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
  <h3 className="text-2xl font-bold mb-4">
    Complaint Status Overview
  </h3>

  <div style={{ width: "100%", height: 300 }}>
    <ResponsiveContainer>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          outerRadius={100}
          label
        >
          {chartData.map((entry, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>
<div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
  <h3 className="text-2xl font-bold mb-4">
    Complaints by Category
  </h3>

  <div style={{ width: "100%", height: 350 }}>
    <ResponsiveContainer>
      <BarChart data={categoryChartData}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="category" />

        <YAxis />

        <Tooltip />

        <Bar
          dataKey="count"
          fill="#2563eb"
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>
  <h2 className="text-3xl font-bold text-slate-800">
    Recent Complaints
  </h2>

  <div className="flex gap-3">
  <button
    onClick={exportToExcel}
    className="bg-green-600 text-white px-4 py-2 rounded-xl"
  >
    Export Excel
  </button>

  <button
    onClick={handleLogout}
    className="bg-red-600 text-white px-4 py-2 rounded-xl"
  >
    Logout
  </button>
</div>
</div>
        <input
  type="text"
  placeholder="Search Complaint ID, Name or Mobile"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="w-full mb-6 border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
/>

<div className="flex gap-3 mb-6 flex-wrap">
  {["All", "Pending", "Resolved", "Escalated"].map(
    (status) => (
      <button
        key={status}
        onClick={() => setStatusFilter(status)}
        className={`px-4 py-2 rounded-xl font-medium ${
          statusFilter === status
            ? "bg-blue-700 text-white"
            : "bg-slate-100 text-slate-700"
        }`}
      >
        {status}
      </button>
    )
  )}






</div>

<table className="w-full min-w-[700px]">
  <thead>
    <tr className="border-b border-slate-200 text-left">
      <th className="py-4">Complaint ID</th>
      <th>Name</th>
      <th>Category</th>
      <th>Status</th>
<th>Document</th>
<th>Date</th>
    </tr>
  </thead>

  <tbody>
    {filteredComplaints.map((complaint) => (
      <tr
        key={complaint._id}
        className="border-b border-slate-100"
      >
        <td className="py-4">
          {complaint.complaintId}
        </td>

        <td>{complaint.name}</td>

        <td>{complaint.category}</td>

        <td>
          <div className="flex items-center gap-2">
            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
              {complaint.status}
            </span>

            {complaint.status !== "Resolved" && (
              <button
                onClick={() =>
                  updateStatus(complaint._id)
                }
                className="bg-green-600 text-white px-3 py-1 rounded text-sm"
              >
                Resolve
              </button>
            )}
          </div>
        </td>
<td>
  {complaint.document ? (
    <a
      href={`https://sir-control-room-backend.onrender.com//uploads/${complaint.document}`}
      target="_blank"
      rel="noreferrer"
      className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
    >
      View Document
    </a>
  ) : (
    <span>No File</span>
  )}
</td>
        <td>
          {new Date(
            complaint.createdAt
          ).toLocaleDateString()}
        </td>
      </tr>
    ))}
  </tbody>
</table>
      </div>
    </section>
  );
}

function Input({ label, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
function LoginPage({
  loginData,
  setLoginData,
  handleLogin,
}) {
  return (
    <section className="max-w-md mx-auto py-20">
      <div className="bg-white p-8 rounded-3xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6">
          Admin Login
        </h2>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={loginData.username}
            onChange={(e) =>
              setLoginData({
                ...loginData,
                username: e.target.value,
              })
            }
            className="w-full border p-3 rounded-xl mb-4"
          />

          <input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({
                ...loginData,
                password: e.target.value,
              })
            }
            className="w-full border p-3 rounded-xl mb-4"
          />

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-3 rounded-xl"
          >
            Login
          </button>
        </form>
      </div>
    </section>
  );
}

function StatCard({ title, value, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-700",
    yellow: "bg-yellow-50 text-yellow-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className={`${colors[color]} p-6 rounded-3xl shadow-sm`}>
      <h3 className="text-4xl font-bold">{value}</h3>
      <p className="mt-2 font-medium">{title}</p>
    </div>
  );
}

function FeatureCard({ title, icon }) {
  return (
    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 hover:shadow-lg transition text-center">
      <div className="text-5xl">{icon}</div>
      <h3 className="text-xl font-bold text-slate-800 mt-5">{title}</h3>
    </div>
  );
}

function InfoCard() {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-slate-800 mb-4">
        Important Information
      </h3>

      <ul className="space-y-4 text-slate-600 text-sm">
        <li>✔ Provide accurate details.</li>
        <li>✔ Keep acknowledgment number safe.</li>
        <li>✔ Upload valid documents.</li>
        <li>✔ Track status online anytime.</li>
      </ul>
    </div>
  );
}

function HelpCard() {
  return (
    <div className="bg-green-50 rounded-3xl shadow-lg p-6 border border-green-100">
      <h3 className="text-xl font-bold text-green-700">Need Help?</h3>

      <p className="text-slate-600 mt-3">Call Helpline Number</p>

      <h2 className="text-5xl font-bold text-green-700 mt-2">1950</h2>

      <p className="text-slate-500 mt-4 text-sm">
        Working Hours: 9:00 AM – 6:00 PM
      </p>
    </div>
  );
}
