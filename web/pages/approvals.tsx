import React, { useState } from "react";

const initialApprovals = [
  {
    id: 1,
    employee: "Jane Doe",
    type: "Leave",
    details: "Annual leave for 3 days",
    status: "Pending",
    history: [],
    comments: [],
  },
  {
    id: 2,
    employee: "John Smith",
    type: "E-Request",
    details: "Request for new laptop",
    status: "Pending",
    history: [],
    comments: [],
  },
  {
    id: 3,
    employee: "Alice Lee",
    type: "Leave",
    details: "Sick leave for 1 day",
    status: "Approved",
    history: [{ action: "Approved", by: "Manager", date: "2024-05-01" }],
    comments: ["Get well soon!"],
  },
];
const filters = [
  "All",
  "Pending",
  "Approved",
  "Rejected",
  "Leave",
  "E-Request",
];

const Approvals = () => {
  const [approvals, setApprovals] = useState(initialApprovals);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(
    null as null | (typeof initialApprovals)[0],
  );
  const [comment, setComment] = useState("");

  const filtered = approvals.filter((a) => {
    if (filter === "All") return true;
    if (["Pending", "Approved", "Rejected"].includes(filter))
      return a.status === filter;
    return a.type === filter;
  });

  const handleAction = (id: number, action: "Approved" | "Rejected") => {
    setApprovals((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: action,
              history: [
                ...a.history,
                {
                  action,
                  by: "You",
                  date: new Date().toISOString().slice(0, 10),
                },
              ],
            }
          : a,
      ),
    );
  };
  const addComment = () => {
    if (!comment.trim() || !selected) return;
    setApprovals((prev) =>
      prev.map((a) =>
        a.id === selected.id ? { ...a, comments: [...a.comments, comment] } : a,
      ),
    );
    setComment("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-center text-[#0a3d91]">
          Approvals
        </h1>
        <div className="flex gap-2 mb-4">
          {filters.map((f) => (
            <button
              key={f}
              className={`px-3 py-1 rounded font-medium text-xs border transition ${filter === f ? "border-blue-600 text-blue-700 bg-blue-50" : "border-transparent text-gray-500 hover:bg-gray-100"}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <ul className="space-y-4 mb-8">
          {filtered.map((req) => (
            <li
              key={req.id}
              className="bg-gray-50 rounded shadow-sm p-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-6 hover:bg-blue-50 transition"
            >
              <span className="font-semibold">{req.employee}</span>
              <span className="text-gray-500">{req.type}</span>
              <span className="flex-1">{req.details}</span>
              <span
                className={`px-2 py-1 rounded text-xs ${req.status === "Approved" ? "bg-green-100 text-green-700" : req.status === "Rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}
              >
                {req.status}
              </span>
              <button
                className="text-blue-600 underline text-xs"
                onClick={() => setSelected(req)}
              >
                Details
              </button>
              {req.status === "Pending" && (
                <>
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded text-xs mr-2 hover:bg-green-700"
                    onClick={() => handleAction(req.id, "Approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                    onClick={() => handleAction(req.id, "Rejected")}
                  >
                    Reject
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
        {/* Modal for details/comments/history */}
        {selected && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-black text-2xl"
                onClick={() => setSelected(null)}
              >
                &times;
              </button>
              <h2 className="font-bold text-lg mb-2 text-[#0a3d91]">
                {selected.type} Approval
              </h2>
              <div className="mb-2 text-gray-700">{selected.details}</div>
              <div className="mb-2 text-xs text-gray-500">
                Status: {selected.status}
              </div>
              <div className="mb-2">
                <span className="font-medium">Comments:</span>
                <ul className="list-disc ml-6 text-sm text-gray-700">
                  {selected.comments.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
                <div className="flex gap-2 mt-2">
                  <input
                    className="border rounded px-2 py-1 text-sm flex-1"
                    placeholder="Add comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button
                    className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                    onClick={addComment}
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="mb-2">
                <span className="font-medium">History:</span>
                <ul className="list-disc ml-6 text-sm text-gray-700">
                  {selected.history.map((h, i) => (
                    <li key={i}>
                      {h.action} by {h.by} on {h.date}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Approvals;
