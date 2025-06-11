import React, { useState } from "react";
import "./styles.css";

const App = () => {
  const [role, setRole] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [roll, setRoll] = useState("");
  const [branch, setBranch] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [attendanceData, setAttendanceData] = useState({});
  const [studentLoggedIn, setStudentLoggedIn] = useState(false);
  const [studentDate, setStudentDate] = useState("");

  const handleAddStudent = () => {
    if (!roll || !branch) {
      alert("Please enter roll number and branch.");
      return;
    }
    const alreadyExists = students.some(
      (s) => s.roll === roll && s.branch.toLowerCase() === branch.toLowerCase()
    );
    if (alreadyExists) {
      alert("Student with same roll number and branch already exists.");
      return;
    }
    setStudents([...students, { roll, branch }]);
    setRoll("");
    setBranch("");
  };

  const markAttendance = (rollNo, branchName, date, status) => {
    if (!date) {
      alert("Please select a date to mark attendance.");
      return;
    }
    const key = `${rollNo}_${branchName.toLowerCase()}`;
    setAttendanceData((prev) => {
      const updated = {
        ...prev,
        [key]: {
          ...(prev[key] || {}),
          [date]: status,
        },
      };
      // Redirect to student login after marking
      setRole("student");
      setRoll(rollNo);
      setBranch(branchName);
      setStudentDate(date);
      setStudentLoggedIn(false);
      return updated;
    });
  };

  const handleStudentLogin = () => {
    const found = students.find(
      (s) => s.roll === roll && s.branch.toLowerCase() === branch.toLowerCase()
    );
    if (!found) {
      alert("No student found with this roll number and branch.");
      return;
    }
    setStudentLoggedIn(true);
  };

  const attendanceKey = `${roll}_${branch.toLowerCase()}`;

  return (
    <div className="app-container">
      {!role && (
        <div className="form-container vibrant-bg">
          <h2>Select Role</h2>
          <button className="btn-primary" onClick={() => setRole("teacher")}>Teacher</button>
          <button className="btn-secondary" onClick={() => setRole("student")}>Student</button>
        </div>
      )}

      {role === "teacher" && (
        <div className="dashboard-container">
          <h2>Teacher Dashboard</h2>
          <input
            type="text"
            placeholder="Enter Your Name"
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
            className="form-styled input"
          />
          <input
            type="date"
            className="date-picker"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          <input
            type="text"
            placeholder="Roll Number"
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
            required
            className="form-styled input"
          />
          <input
            type="text"
            placeholder="Branch"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            required
            className="form-styled input"
          />
          <button className="btn-primary" onClick={handleAddStudent}>Add Student</button>

          <ul className="student-list-vertical">
            {students.map((student, index) => (
              <li key={index} className="student-item">
                <div><strong>Date:</strong> {selectedDate}</div>
                <div><strong>{student.roll} ({student.branch})</strong></div>
                <div className="attendance-buttons-vertical">
                  <button
                    className="btn-success"
                    onClick={() => markAttendance(student.roll, student.branch, selectedDate, "Present")}
                  >
                    Present
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => markAttendance(student.roll, student.branch, selectedDate, "Absent")}
                  >
                    Absent
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {role === "student" && !studentLoggedIn && (
        <div className="form-container soft-bg">
          <h2>Student Login</h2>
          <input
            type="text"
            placeholder="Roll Number"
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
            className="form-styled input"
          />
          <input
            type="text"
            placeholder="Branch"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="form-styled input"
          />
          <input
            type="date"
            className="date-picker"
            value={studentDate}
            onChange={(e) => setStudentDate(e.target.value)}
          />
          <button className="btn-primary" onClick={handleStudentLogin}>Login</button>
        </div>
      )}

      {role === "student" && studentLoggedIn && (
        <div className="dashboard-container">
          <h2>Your Attendance</h2>
          <div className="attendance-viewer">
            <ul>
              {attendanceData[attendanceKey] ? (
                Object.entries(attendanceData[attendanceKey])
                  .filter(([date]) => !studentDate || date === studentDate)
                  .map(([date, status], i) => (
                    <li key={i}>
                      <strong>Date:</strong> {date} — <strong>Status:</strong> {status}
                    </li>
                  ))
              ) : (
                <li>No attendance records found.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
