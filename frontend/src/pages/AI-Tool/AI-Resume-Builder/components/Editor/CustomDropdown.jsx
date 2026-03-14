import React, { useState, useRef, useEffect } from "react";
import { LucideChevronDown } from "lucide-react";
import "./Forms.css";

const CustomDropdown = ({
  options,
  value,
  onChange,
  disabled = false,
  placeholder = "Select...",
  className = "",
  dropdownClass = "",
}) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);
  
  const selectedOption = options.find((opt) => opt.value === value);

  // The root element is now the wrapper itself, not a .form-group div
  return (
    <div 
      className={`template-select-wrapper ${className} ${disabled ? "disabled" : ""}`} 
      ref={wrapperRef}
      onClick={() => !disabled && setOpen(!open)}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-haspopup="listbox"
      aria-expanded={open}
    >
      <div className="template-select">
        {selectedOption ? selectedOption.label : placeholder}
      </div>
      <LucideChevronDown size={20} className="template-select-icon" />
      
      {open && !disabled && (
        <div className={`custom-dropdown-menu ${dropdownClass}`} role="listbox">
          {options.map((opt) => (
            <button
              className={`dropdown-item ${opt.value === value ? "selected" : ""}`}
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              role="option"
              aria-selected={opt.value === value}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
