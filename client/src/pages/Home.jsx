import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

function Home() {
  const [courses, setCourses] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await API.get("/courses");
        setCourses(response.data.courses || []);
      } catch (error) {
        console.error("HOME COURSES ERROR:", error);
      }
    };

    fetchCourses();
  }, []);

  const featuredCourses = courses.slice(0, 6);

  const faqs = [
    {
      question: "What is LearnAI?",
      answer:
        "LearnAI is an e-learning platform where students can discover courses, enroll, complete lessons, and track their learning progress.",
    },
    {
      question: "Can I learn at my own pace?",
      answer:
        "Yes. LearnAI allows students to continue their courses and complete lessons according to their own learning schedule.",
    },
    {
      question: "Can instructors create courses?",
      answer:
        "Yes. Instructors can create courses, add lessons, manage their course content, and share their knowledge with students.",
    },
    {
      question: "Can I track my course progress?",
      answer:
        "Yes. Students can track completed lessons and monitor their overall learning progress from the student dashboard.",
    },
    {
      question: "Are courses free?",
      answer:
        "LearnAI supports both free and paid courses. The availability depends on the course created by the instructor.",
    },
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="home-page">

      <section className="home-hero">
        <div className="home-hero-content">

          <span className="home-hero-badge">
            🎓 LearnAI Learning Platform
          </span>

          <h1>
            Learn Skills.
            <br />
            Build Your <span>Future.</span>
          </h1>

          <p>
            Discover practical courses, learn from
            structured lessons, track your progress,
            and build skills that help you move forward.
          </p>

          <div className="home-hero-buttons">
            <Link
              to="/courses"
              className="home-primary-btn"
            >
              Explore Courses
              <span>→</span>
            </Link>

            <Link
              to="/register"
              className="home-secondary-btn"
            >
              Get Started
            </Link>
          </div>

          <div className="home-hero-trust">
            <div className="trust-avatars">
              <span>👨‍🎓</span>
              <span>👩‍💻</span>
              <span>🧑‍🎓</span>
              <span>👨‍💻</span>
            </div>

            <div>
              <strong>Learn with confidence</strong>
              <small>
                Learn at your own pace with LearnAI
              </small>
            </div>
          </div>
        </div>

        <div className="home-hero-visual">

          <div className="hero-main-card">
            <div className="hero-card-top">
              <span>📚</span>

              <span className="hero-live-badge">
                ● Learning
              </span>
            </div>

            <h3>Build Your Skills</h3>

            <p>
              Learn through practical courses and
              structured lessons.
            </p>

            <div className="hero-progress-label">
              <span>Your Progress</span>
              <strong>75%</strong>
            </div>

            <div className="hero-progress">
              <div></div>
            </div>

            <div className="hero-card-bottom">
              <span>🎯 8 Lessons</span>
              <span>🚀 Continue</span>
            </div>
          </div>

          <div className="hero-floating-card hero-floating-one">
            <span>⭐</span>
            <div>
              <strong>Learn Smarter</strong>
              <small>Grow every day</small>
            </div>
          </div>

          <div className="hero-floating-card hero-floating-two">
            <span>🎓</span>
            <div>
              <strong>Track Progress</strong>
              <small>Stay on your journey</small>
            </div>
          </div>

        </div>
      </section>

      <section className="home-stats">

        <div className="home-stat">
          <strong>100+</strong>
          <span>Learning Resources</span>
        </div>

        <div className="home-stat">
          <strong>50+</strong>
          <span>Courses</span>
        </div>

        <div className="home-stat">
          <strong>1K+</strong>
          <span>Learning Activities</span>
        </div>

        <div className="home-stat">
          <strong>24/7</strong>
          <span>Learn Anytime</span>
        </div>

      </section>

      <section className="home-section home-features">

        <div className="home-section-heading">

          <span className="home-section-label">
            WHY LEARNAI
          </span>

          <h2>
            Everything You Need
            <br />
            to Keep <span>Learning</span>
          </h2>

          <p>
            LearnAI gives students and instructors
            the tools they need to create a simple,
            organized, and engaging learning experience.
          </p>

        </div>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-icon">
              📚
            </div>

            <h3>Structured Courses</h3>

            <p>
              Learn through organized courses and
              lessons designed for a smooth learning
              journey.
            </p>

            <span className="feature-number">
              01
            </span>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              🎯
            </div>

            <h3>Track Your Progress</h3>

            <p>
              Keep track of completed lessons and
              understand how far you have progressed.
            </p>

            <span className="feature-number">
              02
            </span>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              🚀
            </div>

            <h3>Learn at Your Pace</h3>

            <p>
              Continue learning whenever you want
              and build your skills step by step.
            </p>

            <span className="feature-number">
              03
            </span>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              👨‍🏫
            </div>

            <h3>Instructor Learning</h3>

            <p>
              Instructors can create courses and
              share valuable knowledge with students.
            </p>

            <span className="feature-number">
              04
            </span>
          </div>

        </div>
      </section>

      <section className="home-section home-courses">

        <div className="home-section-heading course-heading">

          <div>
            <span className="home-section-label">
              EXPLORE LEARNING
            </span>

            <h2>
              Discover Your Next
              <br />
              <span>Skill</span>
            </h2>

            <p>
              Explore courses and start building
              practical skills today.
            </p>
          </div>

          <Link
            to="/courses"
            className="view-all-link"
          >
            View All Courses →
          </Link>

        </div>

        {featuredCourses.length > 0 ? (
          <div className="home-course-grid">

            {featuredCourses.map((course) => (
              <article
                className="home-course-card"
                key={course._id}
              >

                <div className="home-course-image">

                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                    />
                  ) : (
                    <div className="home-course-placeholder">
                      <span>🎓</span>
                      <small>LearnAI Course</small>
                    </div>
                  )}

                  <span className="home-course-level">
                    {course.level || "Beginner"}
                  </span>

                </div>

                <div className="home-course-content">

                  <span className="home-course-category">
                    {course.category || "General"}
                  </span>

                  <h3>{course.title}</h3>

                  <p>
                    {course.description?.length > 95
                      ? `${course.description.slice(
                          0,
                          95
                        )}...`
                      : course.description}
                  </p>

                  <div className="home-course-meta">
                    <span>
                      📚 {course.lessons?.length || 0} Lessons
                    </span>

                    <strong>
                      {course.price > 0
                        ? `₹${course.price}`
                        : "Free"}
                    </strong>
                  </div>

                  <Link
                    to={`/courses/${course._id}`}
                    className="home-course-btn"
                  >
                    View Course
                    <span>→</span>
                  </Link>

                </div>

              </article>
            ))}

          </div>
        ) : (
          <div className="home-no-courses">
            <div>📚</div>

            <h3>Courses are coming soon</h3>

            <p>
              New learning content will appear here
              as instructors create courses.
            </p>

            <Link
              to="/courses"
              className="home-primary-btn"
            >
              Explore Courses →
            </Link>
          </div>
        )}

      </section>

      <section className="home-section home-how">

        <div className="home-section-heading">

          <span className="home-section-label">
            HOW IT WORKS
          </span>

          <h2>
            Start Learning in
            <br />
            <span>Simple Steps</span>
          </h2>

          <p>
            Getting started with LearnAI is simple.
            Create an account and begin your learning
            journey.
          </p>

        </div>

        <div className="how-grid">

          <div className="how-card">
            <div className="how-number">01</div>

            <div className="how-icon">
              👤
            </div>

            <h3>Create Your Account</h3>

            <p>
              Register on LearnAI and create your
              learning profile.
            </p>
          </div>

          <div className="how-line"></div>

          <div className="how-card">
            <div className="how-number">02</div>

            <div className="how-icon">
              🔎
            </div>

            <h3>Choose a Course</h3>

            <p>
              Explore available courses and choose
              something you want to learn.
            </p>
          </div>

          <div className="how-line"></div>

          <div className="how-card">
            <div className="how-number">03</div>

            <div className="how-icon">
              🚀
            </div>

            <h3>Start Learning</h3>

            <p>
              Enroll in a course and start completing
              lessons at your own pace.
            </p>
          </div>

        </div>
      </section>

      <section className="home-learning-section">

        <div className="learning-visual">

          <div className="learning-dashboard-card">

            <div className="learning-card-header">
              <span>My Learning</span>
              <span>•••</span>
            </div>

            <div className="learning-course-row">
              <div className="learning-course-icon">
                💻
              </div>

              <div>
                <strong>Web Development</strong>
                <span>Continue Learning</span>
              </div>
            </div>

            <div className="learning-progress-text">
              <span>Course Progress</span>
              <strong>72%</strong>
            </div>

            <div className="learning-progress">
              <div></div>
            </div>

            <div className="learning-lessons">
              <span>✓ Introduction</span>
              <span>✓ HTML Basics</span>
              <span>✓ CSS Basics</span>
              <span>○ JavaScript</span>
            </div>

          </div>

        </div>

        <div className="learning-content">

          <span className="home-section-label">
            LEARNING EXPERIENCE
          </span>

          <h2>
            Keep Learning.
            <br />
            <span>Keep Growing.</span>
          </h2>

          <p>
            Your learning journey should never feel
            complicated. LearnAI helps you organize
            your courses, complete lessons, and keep
            track of your progress in one place.
          </p>

          <div className="learning-points">

            <div>
              <span>✓</span>
              <p>
                Continue your learning journey
                whenever you return.
              </p>
            </div>

            <div>
              <span>✓</span>
              <p>
                Track completed lessons and
                overall course progress.
              </p>
            </div>

            <div>
              <span>✓</span>
              <p>
                Build knowledge through structured
                learning content.
              </p>
            </div>

          </div>

          <Link
            to="/courses"
            className="home-primary-btn"
          >
            Start Learning
            <span>→</span>
          </Link>

        </div>

      </section>

      <section className="home-section home-reviews">

        <div className="home-section-heading">

          <span className="home-section-label">
            STUDENT REVIEWS
          </span>

          <h2>
            What Learners
            <br />
            <span>Think About LearnAI</span>
          </h2>

          <p>
            A great learning platform grows with
            the people who use it.
          </p>

        </div>

        <div className="review-grid">

          <div className="review-card">

            <div className="review-stars">
              ★★★★★
            </div>

            <p>
              "LearnAI makes it easy to organize
              courses and continue learning without
              losing track of my progress."
            </p>

            <div className="review-user">
              <div>AS</div>

              <span>
                <strong>Alex Sharma</strong>
                <small>Student</small>
              </span>
            </div>

          </div>

          <div className="review-card">

            <div className="review-stars">
              ★★★★★
            </div>

            <p>
              "I really like the simple course
              structure. I can easily see lessons
              and continue where I stopped."
            </p>

            <div className="review-user">
              <div>RK</div>

              <span>
                <strong>Rahul Kumar</strong>
                <small>Student</small>
              </span>
            </div>

          </div>

          <div className="review-card">

            <div className="review-stars">
              ★★★★☆
            </div>

            <p>
              "The instructor experience makes it
              simple to create and manage courses
              for students."
            </p>

            <div className="review-user">
              <div>PM</div>

              <span>
                <strong>Priya Mehta</strong>
                <small>Instructor</small>
              </span>
            </div>

          </div>

        </div>

        <div className="rating-summary">

          <div className="rating-number">
            <strong>4.8</strong>
            <span>★★★★★</span>
            <small>Platform Rating</small>
          </div>

          <div className="rating-text">
            <h3>Learning that keeps you moving.</h3>

            <p>
              Ratings and reviews help us understand
              the learning experience and improve the
              platform.
            </p>
          </div>

        </div>

      </section>

      <section className="home-section home-faq">

        <div className="home-section-heading">

          <span className="home-section-label">
            FAQ
          </span>

          <h2>
            Frequently Asked
            <br />
            <span>Questions</span>
          </h2>

          <p>
            Everything you need to know about
            getting started with LearnAI.
          </p>

        </div>

        <div className="faq-list">

          {faqs.map((faq, index) => (
            <div
              className={`faq-item ${
                openFaq === index
                  ? "faq-open"
                  : ""
              }`}
              key={index}
            >

              <button
                type="button"
                onClick={() => toggleFaq(index)}
              >
                <span>{faq.question}</span>

                <strong>
                  {openFaq === index
                    ? "−"
                    : "+"}
                </strong>
              </button>

              {openFaq === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}

            </div>
          ))}

        </div>

      </section>

      <section className="home-cta">

        <div className="home-cta-content">

          <span>🎓 LEARN WITH LEARNAI</span>

          <h2>
            Ready to Start
            <br />
            Your Learning Journey?
          </h2>

          <p>
            Explore courses, build new skills,
            and take the next step toward your goals.
          </p>

          <div className="home-cta-buttons">

            <Link
              to="/courses"
              className="home-cta-primary"
            >
              Explore Courses →
            </Link>

            <Link
              to="/register"
              className="home-cta-secondary"
            >
              Create Free Account
            </Link>

          </div>

        </div>

      </section>

      <footer className="home-footer">

        <div className="home-footer-main">

          <div className="home-footer-brand">

            <Link
              to="/"
              className="home-footer-logo"
            >
              🎓 <span>LearnAI</span>
            </Link>

            <p>
              A modern e-learning platform designed
              to help students learn, grow, and build
              practical skills.
            </p>

            <div className="footer-socials">
              <a href="#top" aria-label="Website">
                🌐
              </a>

              <a href="#top" aria-label="GitHub">
                💻
              </a>

              <a href="#top" aria-label="LinkedIn">
                in
              </a>
            </div>

          </div>

          <div className="home-footer-column">

            <h3>Platform</h3>

            <Link to="/courses">
              Courses
            </Link>

            <Link to="/register">
              Register
            </Link>

            <Link to="/login">
              Login
            </Link>

          </div>

          <div className="home-footer-column">

            <h3>Learning</h3>

            <Link to="/courses">
              Explore Courses
            </Link>

            <Link to="/student-dashboard">
              Student Dashboard
            </Link>

            <Link to="/instructor-dashboard">
              Instructor Dashboard
            </Link>

          </div>

          <div className="home-footer-column">

            <h3>LearnAI</h3>

            <a href="#features">
              Features
            </a>

            <a href="#reviews">
              Reviews
            </a>

            <a href="#faq">
              FAQ
            </a>

          </div>

        </div>

        <div className="home-footer-bottom">

          <span>
            © 2026 LearnAI. All rights reserved.
          </span>

          <span>
            Built with ❤️ using MERN Stack
          </span>

        </div>

      </footer>

    </div>
  );
}

export default Home;