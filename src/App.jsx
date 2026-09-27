import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="spinner-border text-primary" role="status" />
      <div className="mt-3 fw-semibold">Loading Student Information System...</div>
    </div>
  );
}

function ProtectedRoute({ user, role, allowedRoles, children }) {
  if (!user) return <Navigate to="/login" replace />;
  if (!role) return <LoadingScreen />;
  if (!allowedRoles.includes(role)) {
    return <Navigate to={role === "admin" ? "/admin" : "/student"} replace />;
  }
  return children;
}

function AppContent() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setAuthError("");

      if (!currentUser) {
        setUser(null);
        setRole(null);
        setAuthLoading(false);
        return;
      }

      setUser(currentUser);

      try {
        const userRef = doc(db, "users", currentUser.uid);
        const snapshot = await getDoc(userRef);

        if (!snapshot.exists()) {
          await setDoc(
            userRef,
            {
              uid: currentUser.uid,
              name: currentUser.displayName || "",
              email: currentUser.email || "",
              role: "student",
              studentId: "",
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
          setRole("student");
        } else {
          setRole(snapshot.data().role || "student");
        }
      } catch (error) {
        console.error(error);
        setAuthError("Unable to load your account information.");
        setRole(null);
      } finally {
        setAuthLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (authLoading || !user || !role) return;

    const path = window.location.pathname;
    if (path === "/login" || path === "/signup" || path === "/") {
      navigate(role === "admin" ? "/admin" : "/student", { replace: true });
    }
  }, [authLoading, user, role, navigate]);

  const createStudentAccount = async ({ name, studentId, email, password }) => {
    setAuthError("");

    const credential = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    await updateProfile(credential.user, { displayName: name.trim() });

    await setDoc(doc(db, "users", credential.user.uid), {
      uid: credential.user.uid,
      name: name.trim(),
      studentId: studentId.trim(),
      email: email.trim(),
      role: "student",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    setUser({ ...credential.user, displayName: name.trim() });
    setRole("student");
    navigate("/student", { replace: true });
  };

  const loginWithGoogle = async () => {
    setAuthError("");

    const result = await signInWithPopup(auth, googleProvider);
    const userRef = doc(db, "users", result.user.uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      await setDoc(userRef, {
        uid: result.user.uid,
        name: result.user.displayName || "",
        email: result.user.email || "",
        studentId: "",
        role: "student",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      navigate("/student", { replace: true });
      return;
    }

    const currentRole = snapshot.data().role || "student";
    navigate(currentRole === "admin" ? "/admin" : "/student", { replace: true });
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setRole(null);
    navigate("/login", { replace: true });
  };

  if (authLoading) return <LoadingScreen />;

  return (
    <>
      {authError && (
        <div className="global-auth-error alert alert-danger m-3 position-fixed top-0 end-0 shadow">
          {authError}
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={<Navigate to={user ? (role === "admin" ? "/admin" : "/student") : "/login"} replace />}
        />

        <Route
          path="/login"
          element={
            user ? (
              <Navigate to={role === "admin" ? "/admin" : "/student"} replace />
            ) : (
              <Login onGoogleLogin={loginWithGoogle} />
            )
          }
        />

        <Route
          path="/signup"
          element={
            user ? (
              <Navigate to="/student" replace />
            ) : (
              <Signup onSignup={createStudentAccount} onGoogleLogin={loginWithGoogle} />
            )
          }
        />

        <Route
          path="/student"
          element={
            <ProtectedRoute user={user} role={role} allowedRoles={["student"]}>
              <StudentDashboard user={user} onLogout={logout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute user={user} role={role} allowedRoles={["admin"]}>
              <AdminDashboard user={user} onLogout={logout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to={user ? (role === "admin" ? "/admin" : "/student") : "/login"}
              replace
            />
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
