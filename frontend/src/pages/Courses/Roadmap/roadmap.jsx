import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  X,
  Send,
  BookOpen,
  Bot,
  ChevronDown,
  ExternalLink,
  Check,
  Loader,
} from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";

import "./roadmap.css";
import { roadmapData } from "./data";

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "#94a3b8", dot: "#94a3b8" },
  { value: "done", label: "Done", color: "#22c55e", dot: "#22c55e" },
  {
    value: "in_progress",
    label: "In Progress",
    color: "#f59e0b",
    dot: "#f59e0b",
  },
  { value: "skip", label: "Skip", color: "#1e293b", dot: "#334155" },
];

// ─── Explain options ──────────────────────────────────────────────────────────
const EXPLAIN_OPTIONS = [
  {
    label: "Explain the topic",
    prompt: "Please explain this topic clearly and concisely.",
  },
  {
    label: "List the key points",
    prompt:
      "List the most important key points about this topic as bullet points.",
  },
  {
    label: "Summarize the topic",
    prompt: "Give me a brief summary of this topic in 3–4 sentences.",
  },
  {
    label: "Explain like I am five",
    prompt:
      "Explain this topic to me like I'm five years old, using simple analogies.",
  },
  {
    label: "Why is it important?",
    prompt: "Why is this topic important? What happens if I skip it?",
  },
];

// ─── Badge component ──────────────────────────────────────────────────────────
const ResourceBadge = ({ type }) => {
  const colors = {
    Article: { bg: "#fef9c3", text: "#854d0e", border: "#fde047" },
    Video: { bg: "#f0fdf4", text: "#166534", border: "#86efac" },
    Paper: { bg: "#eff6ff", text: "#1e40af", border: "#93c5fd" },
    Course: { bg: "#fef9c3", text: "#854d0e", border: "#fde047" },
  };
  const c = colors[type] || colors.Article;
  return (
    <span
      className="resource-badge"
      style={{
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
      }}
    >
      {type}
    </span>
  );
};

// ─── Resources tab content ────────────────────────────────────────────────────
const ResourcesTab = ({ item, statusMap, onStatusChange }) => {
  const [statusOpen, setStatusOpen] = useState(false);
  const statusKey = `${item.id || item.title}`;
  const currentStatus = statusMap[statusKey] || STATUS_OPTIONS[0];
  const resources = item.resources || {};

  const handleStatusSelect = (opt) => {
    onStatusChange(statusKey, opt);
    setStatusOpen(false);
  };

  return (
    <div className="tab-content resources-tab">
      {/* Title + Status row */}
      <div className="rt-title-row">
        <h3 className="rt-title">{item.title}</h3>
        <div className="status-dropdown-wrap">
          <button
            className="status-btn"
            onClick={() => setStatusOpen((v) => !v)}
            style={{ color: currentStatus.color }}
          >
            <span
              className="status-dot"
              style={{ background: currentStatus.dot }}
            />
            {currentStatus.label}
            <ChevronDown size={12} />
          </button>
          <AnimatePresence>
            {statusOpen && (
              <motion.div
                className="status-menu"
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                transition={{ duration: 0.15 }}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    className={`status-menu-item ${currentStatus.value === opt.value ? "active" : ""}`}
                    onClick={() => handleStatusSelect(opt)}
                  >
                    <span
                      className="status-dot"
                      style={{ background: opt.dot }}
                    />
                    {opt.label}
                    {currentStatus.value === opt.value && (
                      <Check size={12} style={{ marginLeft: "auto" }} />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Description */}
      {item.description && <p className="rt-description">{item.description}</p>}

      {/* Free Resources */}
      {resources.free && resources.free.length > 0 && (
        <div className="resource-section">
          <div className="resource-section-header free-header">
            <span className="resource-section-icon">♥</span>
            <span>Free Resources</span>
          </div>
          <div className="resource-list">
            {resources.free.map((r, i) => (
              <a
                key={i}
                href={r.url}
                className="resource-item"
                target="_blank"
                rel="noreferrer"
              >
                <ResourceBadge type={r.type} />
                <span className="resource-title">{r.title}</span>
                <ExternalLink size={11} className="resource-ext-icon" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Premium Resources */}
      {resources.paid && resources.paid.length > 0 && (
        <div className="resource-section">
          <div className="resource-section-header premium-header">
            <span className="resource-section-icon">★</span>
            <span>Premium Resources</span>
          </div>
          <div className="resource-list">
            {resources.paid.map((r, i) => (
              <a
                key={i}
                href={r.url}
                className="resource-item"
                target="_blank"
                rel="noreferrer"
              >
                <ResourceBadge type={r.type} />
                <span className="resource-title">{r.title}</span>
                <ExternalLink size={11} className="resource-ext-icon" />
              </a>
            ))}
          </div>
          <div className="premium-note">
            <strong>Note on Premium Resources</strong>
            <p>These are optional paid resources vetted by the roadmap team.</p>
          </div>
        </div>
      )}

      {/* If no resources */}
      {(!resources.free || resources.free.length === 0) &&
        (!resources.paid || resources.paid.length === 0) && (
          <p className="no-resources">
            No resources available yet for this item.
          </p>
        )}
    </div>
  );
};

// ─── AI Tutor tab content ─────────────────────────────────────────────────────
const AITutorTab = ({ item }) => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      content: "Hey, I am your AI instructor. How can I help you today? 🤖",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [explainOpen, setExplainOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Reset chat when item changes
  useEffect(() => {
    setMessages([
      {
        sender: "bot",
        content: "Hey, I am your AI instructor. How can I help you today? 🤖",
      },
    ]);
    setInputValue("");
    setIsLoading(false);
    setExplainOpen(false);
  }, [item?.title]);

  const buildSystemPrompt = () => {
    const topicName = item?.title || "this topic";
    const topicDesc = item?.description || "";
    const subtopics = item?.subtopics ? item.subtopics.join(", ") : "";
    return `You are an expert AI instructor teaching a RAG (Retrieval-Augmented Generation) course.
The student is currently studying: "${topicName}".
Topic description: ${topicDesc}
Key subtopics: ${subtopics}
Be concise, educational, and encouraging. Use markdown formatting where helpful (bold, bullet points). Keep responses under 200 words unless asked for more detail.`;
  };

  const sendToAPI = async (userMsg) => {
    setIsLoading(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: buildSystemPrompt(),
          messages: [
            ...messages
              .filter((m) => m.sender !== "bot" || m !== messages[0])
              .map((m) => ({
                role: m.sender === "user" ? "user" : "assistant",
                content: typeof m.content === "string" ? m.content : "...",
              })),
            { role: "user", content: userMsg },
          ],
        }),
      });
      const data = await response.json();
      const text =
        data.content?.map((c) => c.text || "").join("") ||
        "Sorry, I couldn't generate a response.";
      setMessages((prev) => [...prev, { sender: "bot", content: text }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          content:
            "⚠️ Couldn't reach the AI. Please check your API connection.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = (e) => {
    e?.preventDefault();
    const msg = inputValue.trim();
    if (!msg || isLoading) return;
    setMessages((prev) => [...prev, { sender: "user", content: msg }]);
    setInputValue("");
    sendToAPI(msg);
  };

  const handleExplainOption = (opt) => {
    setExplainOpen(false);
    const prompt = `[Regarding "${item?.title}"] ${opt.prompt}`;
    setMessages((prev) => [...prev, { sender: "user", content: opt.label }]);
    sendToAPI(prompt);
  };

  const handleTestKnowledge = () => {
    const prompt = `Quiz me on "${item?.title}" with 3 multiple-choice questions. Show one at a time and wait for my answer.`;
    setMessages((prev) => [
      ...prev,
      { sender: "user", content: "Test my Knowledge" },
    ]);
    sendToAPI(prompt);
  };

  // Simple markdown-ish renderer
  const renderBotContent = (text) => {
    if (typeof text !== "string") return text;
    const lines = text.split("\n");
    return lines.map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <strong key={i} style={{ display: "block" }}>
            {line.slice(2, -2)}
          </strong>
        );
      }
      if (line.startsWith("• ") || line.startsWith("- ")) {
        return (
          <li key={i} style={{ marginLeft: "1rem", marginBottom: "2px" }}>
            {line.slice(2)}
          </li>
        );
      }
      if (line.trim() === "") return <br key={i} />;
      // inline bold
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={i} style={{ display: "block" }}>
          {parts.map((p, j) =>
            j % 2 === 1 ? <strong key={j}>{p}</strong> : p,
          )}
        </span>
      );
    });
  };

  return (
    <div className="tab-content ai-tutor-tab">
      {/* Breadcrumb + topic path */}
      <div className="tutor-topic-box">
        <p className="tutor-complete-label">Current topic</p>
        <div className="tutor-breadcrumb">
          <span className="breadcrumb-chip">
            {item?.title || "Select a topic"}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="tutor-actions">
        <div className="tutor-actions-row">
          <div className="explain-wrap">
            <button
              className="tutor-btn explain-btn"
              onClick={() => setExplainOpen((v) => !v)}
            >
              <BookOpen size={14} />
              Explain
              <ChevronDown size={12} />
            </button>
            <AnimatePresence>
              {explainOpen && (
                <motion.div
                  className="explain-menu"
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                >
                  {EXPLAIN_OPTIONS.map((opt, i) => (
                    <button
                      key={i}
                      className="explain-menu-item"
                      onClick={() => handleExplainOption(opt)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            className="tutor-btn test-btn"
            onClick={handleTestKnowledge}
            disabled={isLoading}
          >
            <Bot size={14} />
            Test my Knowledge
          </button>
        </div>
      </div>

      {/* Chat area */}
      <div className="tutor-chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`tutor-bubble ${msg.sender}`}>
            {msg.sender === "bot" && <div className="bot-avatar">🤖</div>}
            <div className={`tutor-bubble-content ${msg.sender}`}>
              {msg.sender === "bot"
                ? renderBotContent(msg.content)
                : msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="tutor-bubble bot">
            <div className="bot-avatar">🤖</div>
            <div className="tutor-bubble-content bot loading-indicator">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="tutor-footer">
        <input
          type="text"
          className="tutor-input"
          placeholder="Ask AI anything about the lesson..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={isLoading}
        />
        <button
          className="tutor-send-btn"
          onClick={handleSend}
          disabled={!inputValue.trim() || isLoading}
          aria-label="Send"
        >
          {isLoading ? (
            <Loader size={16} className="spinning" />
          ) : (
            <Send size={16} />
          )}
        </button>
      </div>
    </div>
  );
};

// ─── Main Roadmap Component ───────────────────────────────────────────────────
const Roadmap = () => {
  const { courseId = "rag-for-beginners" } = useParams();
  const navigate = useNavigate();

  const [windowState, setWindowState] = useState({
    isOpen: false,
    activeItem: null,
    itemType: null,
    parentModule: null,
  });
  const [activeTab, setActiveTab] = useState("resources");
  const [statusMap, setStatusMap] = useState({});
  const [svgPaths, setSvgPaths] = useState([]);
  const treeRef = useRef(null);
  const course = roadmapData[courseId];

  const calculateConnections = useCallback(() => {
    if (!treeRef.current || !course) return;
    const containerRect = treeRef.current.getBoundingClientRect();
    const newPaths = [];

    course.modules.forEach((mod) => {
      if (!mod.topics || mod.topics.length === 0) return;
      const parentEl = document.getElementById(`node-${mod.id}`);
      if (!parentEl) return;

      const parentRect = parentEl.getBoundingClientRect();
      const isLeft = mod.branchDirection === "left";
      const parentY =
        parentRect.top - containerRect.top + parentRect.height / 2;
      const parentX = isLeft
        ? parentRect.left - containerRect.left
        : parentRect.right - containerRect.left;

      mod.topics.forEach((topic, i) => {
        const childEl = document.getElementById(`topic-${mod.id}-${i}`);
        if (!childEl) return;
        const childRect = childEl.getBoundingClientRect();
        const childY = childRect.top - containerRect.top + childRect.height / 2;
        const childX = isLeft
          ? childRect.right - containerRect.left
          : childRect.left - containerRect.left;

        const offset = 40;
        const cp1X = isLeft ? parentX - offset : parentX + offset;
        const cp2X = isLeft ? childX + offset : childX - offset;
        newPaths.push(
          `M ${parentX} ${parentY} C ${cp1X} ${parentY}, ${cp2X} ${childY}, ${childX} ${childY}`,
        );
      });
    });
    setSvgPaths(newPaths);
  }, [course]);

  useEffect(() => {
    if (!treeRef.current) return;
    const observer = new ResizeObserver(() => calculateConnections());
    observer.observe(treeRef.current);
    const timeout = setTimeout(calculateConnections, 100);
    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [calculateConnections]);

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

  const handleItemClick = (item, type, parentModule = null) => {
    setWindowState({
      isOpen: true,
      activeItem: item,
      itemType: type,
      parentModule,
    });
    setActiveTab("resources");
  };

  const toggleChatWindow = () => {
    setWindowState((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  };

  const closeWindow = () => {
    setWindowState({
      isOpen: false,
      activeItem: null,
      itemType: null,
      parentModule: null,
    });
  };

  const handleStatusChange = (key, opt) => {
    setStatusMap((prev) => ({ ...prev, [key]: opt }));
  };

  // Default item when nothing is selected (show course-level info)
  const activeItem = windowState.activeItem || {
    title: course.title,
    description: course.subtitle,
    resources: { free: [], paid: [] },
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
        <p className="roadmap-subtitle">{course.subtitle}</p>
      </header>

      <div className="tree-wrapper" ref={treeRef}>
        <div className="tree-spine-line" aria-hidden="true" />
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="tree-branch left-branch">
                {isLeft && (
                  <div className="topics-container left-container">
                    {mod.topics.map((topic, i) => (
                      <div
                        key={i}
                        id={`topic-${mod.id}-${i}`}
                        className="topic-box clickable-topic"
                        onClick={() => handleItemClick(topic, "topic", mod)}
                      >
                        <span className="topic-title">{topic.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="connector-spacer" />

              <div className="tree-center">
                <div
                  id={`node-${mod.id}`}
                  className={`main-node clickable-topic ${mod.status}`}
                  onClick={() => handleItemClick(mod, "module")}
                >
                  {mod.title}
                </div>
              </div>

              <div className="connector-spacer" />

              <div className="tree-branch right-branch">
                {isRight && (
                  <div className="topics-container right-container">
                    {mod.topics.map((topic, i) => (
                      <div
                        key={i}
                        id={`topic-${mod.id}-${i}`}
                        className="topic-box clickable-topic"
                        onClick={() => handleItemClick(topic, "topic", mod)}
                      >
                        <span className="topic-title">{topic.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* FAB */}
      <button
        className="chat-fab"
        onClick={toggleChatWindow}
        aria-label={windowState.isOpen ? "Close panel" : "Open panel"}
      >
        <img
          src="/eskillveda-chatbot-logo.webp"
          alt="Eskillveda Chatbot"
          className="chat-fab-icon"
        />
      </button>

      {/* Floating Window */}
      <AnimatePresence>
        {windowState.isOpen && (
          <motion.div
            className="floating-window"
            initial={{ opacity: 0, scale: 0.2, x: 20, y: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.2, x: 20, y: 20 }}
            style={{ transformOrigin: "bottom right" }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
          >
            {/* Header */}
            <div className="fw-header">
              {/* Tabs */}
              <div className="fw-tabs">
                <button
                  className={`fw-tab ${activeTab === "resources" ? "active" : ""}`}
                  onClick={() => setActiveTab("resources")}
                >
                  <BookOpen size={13} />
                  Resources
                </button>
                <button
                  className={`fw-tab ${activeTab === "ai_tutor" ? "active" : ""}`}
                  onClick={() => setActiveTab("ai_tutor")}
                >
                  <Bot size={13} />
                  AI Tutor
                </button>
              </div>
              {/* Close */}
              <div className="fw-controls">
                <button
                  className="fw-btn close"
                  onClick={closeWindow}
                  title="Close"
                >
                  <X size={10} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="fw-body">
              <AnimatePresence mode="wait">
                {activeTab === "resources" ? (
                  <motion.div
                    key="resources"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.18 }}
                    style={{ height: "100%", overflow: "hidden" }}
                  >
                    <ResourcesTab
                      item={activeItem}
                      itemType={windowState.itemType}
                      statusMap={statusMap}
                      onStatusChange={handleStatusChange}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="ai_tutor"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.18 }}
                    style={{ height: "100%", overflow: "hidden" }}
                  >
                    <AITutorTab
                      item={activeItem}
                      itemType={windowState.itemType}
                      parentModule={windowState.parentModule}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Roadmap;
