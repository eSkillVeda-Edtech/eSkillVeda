// src/components/AI_Enhancer_btn.jsx
import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import toast from "react-hot-toast";

// --- MODIFIED HELPER FUNCTION ---
// This function now takes an array of strings and converts it into an HTML unordered list.
const formatAsBulletPoints = (pointsArray) => {
  // Check if the input is a valid, non-empty array
  if (!Array.isArray(pointsArray) || pointsArray.length === 0) return '';

  // 1. Map over the array of bullet points.
  // 2. Ensure each point is a string and trim whitespace.
  // 3. Filter out any empty points.
  // 4. Wrap each point in <li> tags.
  // 5. Join them into a single HTML string inside a <ul> tag.
  const listItems = pointsArray
    .map(point => String(point).trim()) 
    .filter(point => point.length > 0)
    .map(point => `<li>${point}</li>`)
    .join('');

  return `<ul>${listItems}</ul>`;
};

const AI_Enhancer_btn = ({ 
  inputText, 
  onEnhance, 
  type = "project", 
  formData = null, 
  isFormComplete = null,
  className = "" 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClickHandler = async () => {
    if (isLoading) return;

    if (type === "summary") {
      if (!isFormComplete || !isFormComplete()) {
        toast.error("Please fill in all required fields...");
        return;
      }
    } else {
      if (!inputText) {
        toast.error("Please add some content to enhance.");
        return;
      }
    }

    setIsLoading(true);
    const toastId = toast.loading("Enhancing content...");

    try {
      const API_URL =
        type === "experience" ? "http://127.0.0.1:8000/experience" :
        type === "project" ? "http://127.0.0.1:8000/project" : 
        "http://127.0.0.1:8000/summary";

      const requestBody = type === "summary" && formData
        ? { resumeData: formData }
        : { description: inputText };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
      }

      const data = await response.json();
      // 'enhancedText' will be an array for project/experience and a string for summary
      const enhancedText =
        type === "experience"
          ? data.enhanced_work_experience
          : type === "summary"
          ? data.professional_summary
          : data.enhanced_description;
      
      if (!enhancedText) {
        throw new Error("No enhanced content received from the server.");
      }

      let processedText = enhancedText;
      // This condition now correctly handles the array response
      if (type === "project" || type === "experience") {
        processedText = formatAsBulletPoints(enhancedText);
      }
      
      if (onEnhance) {
        onEnhance(processedText); // Pass the plain paragraph or HTML list
        toast.success("Content enhanced successfully!", { id: toastId });
      }

    } catch (error) {
      console.error("Failed to enhance text:", error);
      toast.error(`Error: ${error.message}`, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={onClickHandler}
      disabled={isLoading || (isFormComplete && !isFormComplete())}
      className={`toolbar-btn ai-enhance-btn ${className} ${
        (isLoading || (isFormComplete && !isFormComplete())) ? 'disabled' : ''
      }`}
      title={isLoading ? "Enhancing content..." : "Enhance with AI"}
      aria-label={isLoading ? "Enhancing content..." : "Enhance with AI"}
    >
      <Sparkles size={18} />
      <span className="ai-btn-text">
        {isLoading ? "Enhancing..." : "AI"}
      </span>
    </button>
  );
};

export default AI_Enhancer_btn;