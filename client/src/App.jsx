import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Lesson from "./pages/Lesson";
import CreateCourse from "./pages/CreateCourse";
import StudentDashboard from "./pages/StudentDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <main>

        <Routes>

          <Route
            path="/"
            element={
              <Navigate to="/login" replace />
            }
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/courses"
            element={<Courses />}
          />

          <Route
            path="/courses/:id"
            element={<CourseDetails />}
          />

          <Route
            path="/courses/:id/lesson/:lessonIndex"
            element={<Lesson />}
          />

          <Route
            path="/student-dashboard"
            element={<StudentDashboard />}
          />

          <Route
            path="/instructor-dashboard"
            element={<InstructorDashboard />}
          />

          <Route
            path="/create-course"
            element={<CreateCourse />}
          />

          <Route
            path="*"
            element={
              <Navigate to="/courses" replace />
            }
          />

        </Routes>

      </main>

    </BrowserRouter>
  );
}

export default App;