import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function StudentDashboard({ user, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const snapshot = await getDoc(doc(db, "users", user.uid));
        if (snapshot.exists()) setProfile(snapshot.data());

        const studentId = snapshot.data()?.studentId;
        if (studentId) {
          const response = await fetch(`${API_URL}/api/students/${encodeURIComponent(studentId)}`);
          if (response.ok) {
            const data = await response.json();
            setSubjects(data.subjects || []);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user.uid]);

  const name = profile?.name || user.displayName || "Student";
  const studentId = profile?.studentId || "Not assigned";
  const course = profile?.course || "Not assigned";
  const yearLevel = profile?.yearLevel || "Not assigned";
  const section = profile?.section || "Not assigned";

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark"><i className="bi bi-mortarboard-fill" /></div>
          <div><strong>SIS</strong><small>Student Portal</small></div>
        </div>

        <div className="sidebar-menu">
          <div className="menu-label">MAIN</div>
          <a className="sidebar-link active" href="#overview"><i className="bi bi-grid-1x2-fill" /> <span>Dashboard</span></a>
          <a className="sidebar-link" href="#profile"><i className="bi bi-person-vcard" /> <span>My Profile</span></a>
          <a className="sidebar-link" href="#subjects"><i className="bi bi-journal-bookmark-fill" /> <span>Subjects</span></a>
          <a className="sidebar-link" href="#grades"><i className="bi bi-bar-chart-fill" /> <span>Grades</span></a>
        </div>

        <button className="sidebar-logout" onClick={onLogout}>
          <i className="bi bi-box-arrow-left" /> <span>Logout</span>
        </button>
      </aside>

      <main className="dashboard-main" id="overview">
        <header className="dashboard-header">
          <div>
            <span className="eyebrow">STUDENT PORTAL</span>
            <h2>Good day, {name.split(" ")[0]}!</h2>
            <p>Here is your academic information at a glance.</p>
          </div>
          <div className="header-user">
            <div className="avatar">{name.charAt(0).toUpperCase()}</div>
            <div className="d-none d-sm-block"><strong>{name}</strong><small>{studentId}</small></div>
          </div>
        </header>

        {loading ? (
          <div className="card dashboard-card p-5 text-center">
            <div className="spinner-border text-primary" />
          </div>
        ) : (
          <>
            <section className="stat-grid">
              <div className="stat-card"><div className="stat-icon"><i className="bi bi-person-badge" /></div><small>Student ID</small><strong>{studentId}</strong></div>
              <div className="stat-card"><div className="stat-icon"><i className="bi bi-mortarboard" /></div><small>Course</small><strong>{course}</strong></div>
              <div className="stat-card"><div className="stat-icon"><i className="bi bi-layers" /></div><small>Year Level</small><strong>{yearLevel}</strong></div>
              <div className="stat-card"><div className="stat-icon"><i className="bi bi-people" /></div><small>Section</small><strong>{section}</strong></div>
            </section>

            <section className="row g-4 mt-1">
              <div className="col-lg-7" id="profile">
                <div className="dashboard-card h-100">
                  <div className="card-heading"><div><h5>Student Profile</h5><p>Registered information</p></div><i className="bi bi-person-vcard" /></div>
                  <div className="profile-list">
                    <div><span>Full name</span><strong>{name}</strong></div>
                    <div><span>Email</span><strong>{profile?.email || user.email}</strong></div>
                    <div><span>Student ID</span><strong>{studentId}</strong></div>
                    <div><span>Course / Program</span><strong>{course}</strong></div>
                    <div><span>Year level</span><strong>{yearLevel}</strong></div>
                    <div><span>Section</span><strong>{section}</strong></div>
                  </div>
                </div>
              </div>

              <div className="col-lg-5" id="grades">
                <div className="dashboard-card h-100">
                  <div className="card-heading"><div><h5>Academic Status</h5><p>Current student standing</p></div><i className="bi bi-award" /></div>
                  <div className="status-box">
                    <span className="status-dot" />
                    <div><strong>Active Student</strong><small>Your account is active.</small></div>
                  </div>
                  <div className="mini-info"><span>Record status</span><strong>Active</strong></div>
                  <div className="mini-info"><span>Account email</span><strong className="text-truncate">{user.email}</strong></div>
                </div>
              </div>

              <div className="col-12" id="subjects">
                <div className="dashboard-card">
                  <div className="card-heading"><div><h5>Enrolled Subjects</h5><p>Your current subject records</p></div><i className="bi bi-journal-text" /></div>
                  {subjects.length === 0 ? (
                    <div className="empty-state"><i className="bi bi-journal-x" /><p>No subject records are available yet.</p></div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table align-middle mb-0">
                        <thead><tr><th>Code</th><th>Subject</th><th>Units</th><th>Schedule</th><th>Grade</th></tr></thead>
                        <tbody>{subjects.map((subject, index) => (
                          <tr key={subject.code || index}><td className="fw-semibold">{subject.code}</td><td>{subject.name}</td><td>{subject.units}</td><td>{subject.schedule}</td><td>{subject.grade || "—"}</td></tr>
                        ))}</tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
