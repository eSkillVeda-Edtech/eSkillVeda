import React, { useState, useRef, useEffect, useCallback, memo, useMemo } from 'react';
import DOMPurify from 'dompurify';
import AI_Enhancer_btn from './AI_Enhancer_btn';
import './RichTextEditor.css';

// Debounce function
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// --- UI Component: Spinner ---
const Spinner = () => (
  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
);

// --- UI Component: ToolbarButton ---
const ToolbarButton = memo(({ icon, title, onClick, disabled = false, className = '', isLoading = false, isActive = false }) => (
  <button
    type="button"
    className={`toolbar-btn ${className} ${isActive ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
    title={title}
    onClick={!disabled ? onClick : undefined}
    disabled={disabled}
  >
    {isLoading ? <Spinner /> : icon}
  </button>
));
ToolbarButton.displayName = 'ToolbarButton';

// --- UI Component: Modal ---
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};

// --- SVG Icons ---
const BoldIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4.25-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"></path></svg>;
const ItalicIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"></path></svg>;
const UnderlineIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"></path></svg>;
const BulletedListIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"></path></svg>;
const NumberedListIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 11.1V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"></path></svg>;
const UndoIcon = () => <span>↶</span>;
const RedoIcon = () => <span>↷</span>;

// --- Main Component: RichTextEditor ---
const RichTextEditor = memo(({
  value = '',
  onChange,
  placeholder = 'Start typing...',
  className = '',
  showToolbar = true,
  // REMOVED: height prop is no longer used, CSS handles this now
  minHeight = '8rem', // you can still pass a minHeight if needed
  disabled = false,
  showAIEnhancer = true,
  enhancerType = 'project',
  formData = null,
  isFormComplete = null,
}) => {
  const editorRef = useRef(null);
  const [history, setHistory] = useState(['']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [activeFormats, setActiveFormats] = useState({});

  const purifierConfig = useMemo(() => ({
    ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'u', 'ul', 'ol', 'li', 'p', 'br', 'div'],
    ALLOWED_ATTR: [],
  }), []);

  const sanitizeHTML = useCallback((html) => {
    return DOMPurify.sanitize(String(html || ''), purifierConfig);
  }, [purifierConfig]);
  
  const stripHTML = useCallback((html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = String(html || '');
    return tmp.textContent || tmp.innerText || '';
  }, []);

  const isContentEmpty = useCallback((content) => {
    return !content || stripHTML(content).trim() === '';
  }, [stripHTML]);

  const saveToHistory = useCallback((content) => {
    setHistory(prevHistory => {
      const newHistory = prevHistory.slice(0, historyIndex + 1);
      if (newHistory[newHistory.length - 1] === content) return prevHistory;
      
      newHistory.push(content);
      if (newHistory.length > 50) newHistory.shift();
      
      setHistoryIndex(newHistory.length - 1);
      return newHistory;
    });
  }, [historyIndex]);

  const debouncedSaveToHistory = useCallback(debounce(saveToHistory, 500), [saveToHistory]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const previousContent = history[newIndex];
      
      if (editorRef.current && onChange) {
        editorRef.current.innerHTML = previousContent;
        onChange(previousContent);
      }
    }
  }, [historyIndex, history, onChange]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const nextContent = history[newIndex];
      
      if (editorRef.current && onChange) {
        editorRef.current.innerHTML = nextContent;
        onChange(nextContent);
      }
    }
  }, [historyIndex, history, onChange]);

  const updateActiveFormats = useCallback(() => {
    const formats = {};
    const commands = ['bold', 'italic', 'underline', 'insertUnorderedList', 'insertOrderedList'];
    commands.forEach(command => {
      formats[command] = document.queryCommandState(command);
    });
    setActiveFormats(formats);
  }, []);
  
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleSelectionChange = () => {
      if (window.getSelection && editor.contains(window.getSelection().anchorNode)) {
        updateActiveFormats();
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    editor.addEventListener('keyup', handleSelectionChange);
    editor.addEventListener('click', handleSelectionChange);
    editor.addEventListener('focus', handleSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [updateActiveFormats]);

  const handleFormat = useCallback((command) => {
    if (editorRef.current && !disabled) {
      editorRef.current.focus();
      document.execCommand(command, false, null);
      const newContent = editorRef.current.innerHTML;
      if (onChange) {
        onChange(newContent);
      }
      debouncedSaveToHistory(newContent);
      updateActiveFormats();
    }
  }, [onChange, disabled, debouncedSaveToHistory, updateActiveFormats]);
  
  useEffect(() => {
    const sanitizedValue = sanitizeHTML(value);
    if (editorRef.current && editorRef.current.innerHTML !== sanitizedValue) {
      editorRef.current.innerHTML = sanitizedValue;
    }
  }, [value, sanitizeHTML]);
  
  const handleInput = useCallback(() => {
    if (onChange && editorRef.current && !disabled) {
      const currentContent = editorRef.current.innerHTML;
      onChange(currentContent);
      debouncedSaveToHistory(currentContent);
    }
  }, [onChange, disabled, debouncedSaveToHistory]);

  const handleKeyDown = useCallback((e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b': e.preventDefault(); handleFormat('bold'); break;
        case 'i': e.preventDefault(); handleFormat('italic'); break;
        case 'u': e.preventDefault(); handleFormat('underline'); break;
        case 'z':
          e.preventDefault();
          e.shiftKey ? handleRedo() : handleUndo();
          break;
        case 'y':
          e.preventDefault();
          handleRedo();
          break;
        default: break;
      }
    }
  }, [handleUndo, handleRedo, handleFormat]);

  useEffect(() => {
    if (history.length === 1 && history[0] === '' && value) {
      saveToHistory(value);
    }
  }, [value, history, saveToHistory]);

  const handleAIEnhance = useCallback((enhancedText) => {
    if (onChange && enhancedText) {
      const sanitized = sanitizeHTML(enhancedText); 
      if (editorRef.current) {
        editorRef.current.innerHTML = sanitized;
      }
      onChange(sanitized);
      saveToHistory(sanitized);
    }
  }, [onChange, sanitizeHTML, saveToHistory]);

  if (!onChange) {
    console.error('RichTextEditor: onChange prop is required');
    return null;
  }

  return (
    // MODIFIED: Added a consistent container class and removed props from className
    <div className={`rich-text-editor-container ${className}`}>
      {showToolbar && (
        <div className="toolbar">
          <div className="toolbar-group">
            <ToolbarButton icon={<BoldIcon />} title="Bold (Ctrl+B)" onClick={() => handleFormat('bold')} isActive={activeFormats.bold} />
            <ToolbarButton icon={<ItalicIcon />} title="Italic (Ctrl+I)" onClick={() => handleFormat('italic')} isActive={activeFormats.italic} />
            <ToolbarButton icon={<UnderlineIcon />} title="Underline (Ctrl+U)" onClick={() => handleFormat('underline')} isActive={activeFormats.underline} />
            <ToolbarButton icon={<BulletedListIcon />} title="Bulleted List" onClick={() => handleFormat('insertUnorderedList')} isActive={activeFormats.insertUnorderedList} />
            <ToolbarButton icon={<NumberedListIcon />} title="Numbered List" onClick={() => handleFormat('insertOrderedList')} isActive={activeFormats.insertOrderedList} />
          </div>
          <div className="toolbar-group">
            {showAIEnhancer && (
              <AI_Enhancer_btn
                inputText={stripHTML(value)}
                onEnhance={handleAIEnhance}
                type={enhancerType}
                formData={formData}
                isFormComplete={isFormComplete}
                className="toolbar-btn"
              />
            )}
            <ToolbarButton icon={<UndoIcon />} title="Undo (Ctrl+Z)" onClick={handleUndo} disabled={historyIndex <= 0} />
            <ToolbarButton icon={<RedoIcon />} title="Redo (Ctrl+Y)" onClick={handleRedo} disabled={historyIndex >= history.length - 1} />
          </div>
        </div>
      )}
      {/* MODIFIED: Changed class to editor-content and removed height from className */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        data-placeholder={isContentEmpty(value) ? placeholder : ''}
        className="editor-content"
        style={{ minHeight, wordBreak: 'break-word' }}
      />
    </div>
  );
});

RichTextEditor.displayName = 'RichTextEditor';
export default RichTextEditor;
