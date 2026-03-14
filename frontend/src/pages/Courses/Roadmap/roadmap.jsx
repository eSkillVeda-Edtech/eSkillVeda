import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, X, Send } from "lucide-react";

// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";

import "./roadmap.css";
import { roadmapData } from "./data";

const Roadmap = () => {
  const { courseId = "ai-engineering" } = useParams();
  const navigate = useNavigate();

  const [activeTopic, setActiveTopic] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [svgPaths, setSvgPaths] = useState([]); // State to hold the dynamic path strings

  const course = roadmapData[courseId];
  const treeRef = useRef(null); // Ref for the container to calculate relative coordinates

  // --- Dynamic Connection Calculation Logic ---
  const calculateConnections = useCallback(() => {
    if (!treeRef.current || !course) return;

    // Get the bounding box of the entire tree container
    const containerRect = treeRef.current.getBoundingClientRect();
    const newPaths = [];

    course.modules.forEach((mod) => {
      if (!mod.topics || mod.topics.length === 0) return;

      // Find the Parent Node DOM element
      const parentEl = document.getElementById(`node-${mod.id}`);
      if (!parentEl) return;

      const parentRect = parentEl.getBoundingClientRect();
      const isLeft = mod.branchDirection === "left";

      // Calculate Parent Coordinates relative to the container
      const parentY =
        parentRect.top - containerRect.top + parentRect.height / 2;
      const parentX = isLeft
        ? parentRect.left - containerRect.left
        : parentRect.right - containerRect.left;

      // Iterate through child topics to draw lines
      mod.topics.forEach((topic, i) => {
        const childEl = document.getElementById(`topic-${mod.id}-${i}`);
        if (!childEl) return;

        const childRect = childEl.getBoundingClientRect();

        // Calculate Child Coordinates relative to the container
        const childY = childRect.top - containerRect.top + childRect.height / 2;
        const childX = isLeft
          ? childRect.right - containerRect.left
          : childRect.left - containerRect.left;

        // Curvature strength (how far the curve stretches horizontally)
        const offset = 40;
        const cp1X = isLeft ? parentX - offset : parentX + offset;
        const cp2X = isLeft ? childX + offset : childX - offset;

        // Construct the cubic Bezier path string
        const pathData = `M ${parentX} ${parentY} C ${cp1X} ${parentY}, ${cp2X} ${childY}, ${childX} ${childY}`;
        newPaths.push(pathData);
      });
    });

    setSvgPaths(newPaths);
  }, [course]);

  // Use a ResizeObserver to trigger recalculations when the DOM changes size
  useEffect(() => {
    if (!treeRef.current) return;

    const observer = new ResizeObserver(() => {
      calculateConnections();
    });

    observer.observe(treeRef.current);

    // Fallback: recalculate after initial render to ensure DOM paints are complete
    const timeout = setTimeout(calculateConnections, 100);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [calculateConnections]);

  // --- Chat Side Panel Logic ---
  useEffect(() => {
    if (activeTopic) {
      setChatMessages([
        {
          role: "system",
          content: "Here are the key areas we need to cover in this topic:",
          subtopics: activeTopic.subtopics || [],
        },
      ]);
    } else {
      setChatMessages([]);
      setInputValue("");
    }
  }, [activeTopic]);

  if (!course) {
    return (
      <div className="roadmap-error" role="alert">
        <h2>Course Roadmap Not Found</h2>
        <button onClick={() => navigate("/courses")} className="back-btn">
          Return to Courses
        </button>
      </div>
    );
  }

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setChatMessages((prev) => [...prev, { role: "user", content: inputValue }]);
    setInputValue("");
  };

  const renderTopic = (topic, index, modId) => {
    const title = typeof topic === "string" ? topic : topic.title;
    return (
      <div
        key={index}
        id={`topic-${modId}-${index}`} /* Added Dynamic ID */
        className="topic-box clickable-topic"
        onClick={() => setActiveTopic(topic)}
      >
        <span className="topic-title">{title}</span>
      </div>
    );
  };

  return (
    <div className="roadmap-container">
      <nav className="roadmap-nav">
        <button className="back-btn" onClick={() => navigate("/courses")}>
          <ArrowLeft size={18} aria-hidden="true" /> All Roadmaps
        </button>
      </nav>

      <header className="roadmap-header">
        <h1 className="roadmap-title">{course.title}</h1>
      </header>

      {/* Added treeRef here */}
      <div className="tree-wrapper" ref={treeRef}>
        {/* Central blue spine */}
        <div className="tree-spine-line" aria-hidden="true"></div>

        {/* --- NEW OVERLAY SVG --- */}
        <svg className="connections-overlay">
          {svgPaths.map((d, idx) => (
            <path
              key={idx}
              d={d}
              fill="none"
              stroke="var(--roadmap-primary-blue)"
              strokeWidth="2.5"
              strokeDasharray="4 4"
            />
          ))}
        </svg>

        {course.modules.map((mod) => {
          if (mod.isLabelOnly) {
            return (
              <div key={mod.id} className="tree-row label-row">
                <span className="spine-label">{mod.title}</span>
              </div>
            );
          }

          const isLeft = mod.branchDirection === "left";
          const isRight = mod.branchDirection === "right";

          return (
            <motion.div
              key={mod.id}
              className={`tree-row ${mod.status}`}
              // Removed initial, whileInView, and viewport props
              // The component will now render in its final position immediately
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Left Side */}
              <div className="tree-branch left-branch">
                {isLeft && (
                  <div className="topics-container left-container">
                    {mod.topics.map((topic, i) =>
                      renderTopic(topic, i, mod.id),
                    )}
                  </div>
                )}
              </div>

              {/* Spacers maintain UI layout */}
              <div className="connector-spacer" />

              {/* Center Node */}
              <div className="tree-center">
                <div
                  id={`node-${mod.id}`}
                  className={`main-node ${mod.status}`}
                >
                  {mod.title}
                </div>
              </div>

              <div className="connector-spacer" />

              {/* Right Side */}
              <div className="tree-branch right-branch">
                {isRight && (
                  <div className="topics-container right-container">
                    {mod.topics.map((topic, i) =>
                      renderTopic(topic, i, mod.id),
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Side Panel Implementation (Unchanged) */}
      <AnimatePresence>
        {activeTopic && (
          <>
            <motion.div
              className="side-panel-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveTopic(null)}
            />

            <motion.div
              className="side-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="panel-header">
                <div className="panel-title-group">
                  <h3>{activeTopic.title}</h3>
                </div>
                <button
                  className="close-panel-btn"
                  onClick={() => setActiveTopic(null)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="chat-body">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`chat-message ${msg.role}`}>
                    <div className="message-content">
                      <p>{msg.content}</p>
                      {msg.subtopics && msg.subtopics.length > 0 && (
                        <ul className="subtopic-list">
                          {msg.subtopics.map((sub, i) => (
                            <li key={i}>{sub}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <form className="chat-input-area" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  placeholder="Ask a question..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="send-btn"
                >
                  <Send size={18} />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Roadmap;
