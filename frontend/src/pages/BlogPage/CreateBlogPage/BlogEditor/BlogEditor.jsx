import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Undo, 
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  Code,
  Link
} from 'lucide-react';
import DOMPurify from 'dompurify';
import './BlogEditor.css';

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

// UI Components
const ToolbarButton = memo(({ 
  icon: Icon, 
  title, 
  onClick, 
  disabled = false, 
  isActive = false,
  className = ''
}) => (
  <button
    type="button"
    className={`toolbar-btn ${isActive ? 'active' : ''} ${className}`}
    onClick={onClick}
    disabled={disabled}
    title={title}
    aria-label={title}
  >
    <Icon size={16} />
  </button>
));
ToolbarButton.displayName = 'ToolbarButton';

const LinkModal = ({ isOpen, onClose, onInsert, theme = 'light' }) => {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    if (isOpen) {
      const selection = window.getSelection().toString().trim();
      setText(selection);
    }
  }, [isOpen]);

  const handleInsert = () => {
    if (url.trim()) {
      onInsert(url.trim(), text.trim() || url.trim());
      setUrl('');
      setText('');
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleInsert();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" data-theme={theme} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Insert Link</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="link-url">URL</label>
            <input
              id="link-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="https://example.com"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="link-text">Text (optional)</label>
            <input
              id="link-text"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Text to display"
            />
          </div>
          <div className="modal-actions">
            <button onClick={onClose} className="btn-secondary">Cancel</button>
            <button onClick={handleInsert} className="btn-primary" disabled={!url.trim()}>
              Insert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main BlogEditor Component
const BlogEditor = ({ 
  value = '', 
  onChange = () => {}, 
  placeholder = "Start writing your amazing blog post here...", 
  disabled = false,
  theme = 'light',
  className = '',
  maxLength,
  minHeight = 400
}) => {
  const editorRef = useRef(null);
  const [history, setHistory] = useState(['']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [activeFormats, setActiveFormats] = useState({});
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  const sanitizeHTML = useCallback((html) => {
    if (!html || typeof html !== 'string') return '';
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'div', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'style'],
    });
  }, []);

  const stripHTML = useCallback((html) => {
    if (!html) return '';
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  }, []);

  const isContentEmpty = useCallback((content) => !content || stripHTML(content).trim() === '', [stripHTML]);

  const updateCounts = useCallback((content) => {
    const text = stripHTML(content);
    setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
    setCharCount(text.length);
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

  const debouncedSaveToHistory = useCallback(debounce(saveToHistory, 1000), [saveToHistory]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const previousContent = history[newIndex];
      if (editorRef.current) {
        editorRef.current.innerHTML = previousContent;
        onChange(previousContent);
        updateCounts(previousContent);
      }
    }
  }, [historyIndex, history, onChange, updateCounts]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const nextContent = history[newIndex];
      if (editorRef.current) {
        editorRef.current.innerHTML = nextContent;
        onChange(nextContent);
        updateCounts(nextContent);
      }
    }
  }, [historyIndex, history, onChange, updateCounts]);

  const updateActiveFormats = useCallback(() => {
    const formats = {};
    const commands = ['bold', 'italic', 'underline', 'insertUnorderedList', 'insertOrderedList', 'justifyLeft', 'justifyCenter', 'justifyRight'];
    commands.forEach(command => {
      try {
        formats[command] = document.queryCommandState(command);
      } catch (e) {
        formats[command] = false;
      }
    });
    setActiveFormats(formats);
  }, []);

  const handleFormat = useCallback((command, value = null) => {
    if (editorRef.current && !disabled) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
      const newContent = editorRef.current.innerHTML;
      onChange(newContent);
      debouncedSaveToHistory(newContent);
      updateActiveFormats();
      updateCounts(newContent);
    }
  }, [onChange, debouncedSaveToHistory, updateActiveFormats, updateCounts, disabled]);

  const handleInsertLink = useCallback((url, text) => {
    handleFormat('insertHTML', `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>&nbsp;`);
  }, [handleFormat]);

  const handleBlockquote = useCallback(() => handleFormat('formatBlock', 'blockquote'), [handleFormat]);

  useEffect(() => {
    const sanitizedValue = sanitizeHTML(value);
    if (editorRef.current && editorRef.current.innerHTML !== sanitizedValue) {
      editorRef.current.innerHTML = sanitizedValue;
    }
    updateCounts(sanitizedValue);
  }, [value, sanitizeHTML, updateCounts]);

  const handleInput = useCallback(() => {
    if (onChange && editorRef.current && !disabled) {
      const currentContent = editorRef.current.innerHTML;
      if (maxLength && stripHTML(currentContent).length > maxLength) {
        editorRef.current.innerHTML = history[historyIndex];
        return;
      }
      onChange(currentContent);
      updateCounts(currentContent);
      debouncedSaveToHistory(currentContent);
    }
  }, [onChange, disabled, debouncedSaveToHistory, updateCounts, maxLength, stripHTML, history, historyIndex]);

  const handleKeyDown = useCallback((e) => {
    if (e.ctrlKey || e.metaKey) {
      const commandMap = { 'b': 'bold', 'i': 'italic', 'u': 'underline' };
      if (commandMap[e.key]) { e.preventDefault(); handleFormat(commandMap[e.key]); }
      else if (e.key === 'z') { e.preventDefault(); e.shiftKey ? handleRedo() : handleUndo(); }
      else if (e.key === 'y') { e.preventDefault(); handleRedo(); }
      else if (e.key === 'k') { e.preventDefault(); setIsLinkModalOpen(true); }
    }
  }, [handleUndo, handleRedo, handleFormat]);

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData).getData('text');
    handleFormat('insertText', paste);
  }, [handleFormat]);

  useEffect(() => {
    const handleSelectionChange = () => {
      if (editorRef.current && window.getSelection().containsNode(editorRef.current, true)) {
        updateActiveFormats();
      }
    };
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [updateActiveFormats]);

  useEffect(() => {
    if (history.length === 1 && history[0] === '' && value) {
      saveToHistory(value);
    }
  }, [value, history, saveToHistory]);

  return (
    <>
      <div className={`prose-editor ${className}`} data-theme={theme}>
        {/* Two-Row Toolbar */}
        <div className="toolbar">
          {/* First Row - Main Formatting Tools */}
          <div className="toolbar-row-1">
            <ToolbarButton
              icon={Bold}
              title="Bold (Ctrl+B)"
              onClick={() => handleFormat('bold')}
              disabled={disabled}
              isActive={activeFormats.bold}
            />
            <ToolbarButton
              icon={Italic}
              title="Italic (Ctrl+I)"
              onClick={() => handleFormat('italic')}
              disabled={disabled}
              isActive={activeFormats.italic}
            />
            <ToolbarButton
              icon={Underline}
              title="Underline (Ctrl+U)"
              onClick={() => handleFormat('underline')}
              disabled={disabled}
              isActive={activeFormats.underline}
            />

            <div className="toolbar-divider"></div>

            <ToolbarButton
              icon={List}
              title="Bullet List"
              onClick={() => handleFormat('insertUnorderedList')}
              disabled={disabled}
              isActive={activeFormats.insertUnorderedList}
            />
            <ToolbarButton
              icon={ListOrdered}
              title="Numbered List"
              onClick={() => handleFormat('insertOrderedList')}
              disabled={disabled}
              isActive={activeFormats.insertOrderedList}
            />

            <div className="toolbar-divider"></div>

            <ToolbarButton
              icon={Quote}
              title="Quote"
              onClick={handleBlockquote}
              disabled={disabled}
            />
            <ToolbarButton
              icon={Code}
              title="Code Block"
              onClick={() => handleFormat('formatBlock', 'pre')}
              disabled={disabled}
            />
            <ToolbarButton
              icon={Link}
              title="Insert Link (Ctrl+K)"
              onClick={() => setIsLinkModalOpen(true)}
              disabled={disabled}
            />
          </div>

          {/* Second Row - Alignment Tools */}
          <div className="toolbar-row-2">
            <ToolbarButton
              icon={AlignLeft}
              title="Align Left"
              onClick={() => handleFormat('justifyLeft')}
              disabled={disabled}
              isActive={activeFormats.justifyLeft}
            />
            <ToolbarButton
              icon={AlignCenter}
              title="Align Center"
              onClick={() => handleFormat('justifyCenter')}
              disabled={disabled}
              isActive={activeFormats.justifyCenter}
            />
            <ToolbarButton
              icon={AlignRight}
              title="Align Right"
              onClick={() => handleFormat('justifyRight')}
              disabled={disabled}
              isActive={activeFormats.justifyRight}
            />
          </div>
        </div>

        {/* Editor Content Area */}
        <div 
          ref={editorRef} 
          className="editor-content" 
          contentEditable={!disabled} 
          onInput={handleInput} 
          onKeyDown={handleKeyDown} 
          onPaste={handlePaste} 
          data-placeholder={isContentEmpty(value) ? placeholder : ''} 
          style={{ minHeight }} 
          role="textbox" 
          aria-multiline="true" 
          aria-label="Blog content editor" 
        />

        {/* Status Bar with Word/Character Count and Undo/Redo */}
        <div className="editor-status">
          <div className="status-left">
            <span className="word-count">Words: {wordCount}</span>
            <span className={`char-count ${maxLength && charCount > maxLength * 0.9 ? 'char-warning' : ''}`}>
              Characters: {charCount}{maxLength ? ` / ${maxLength}` : ''}
            </span>
            {maxLength && charCount > maxLength && (
              <span className="char-warning">Exceeds limit by {charCount - maxLength}</span>
            )}
          </div>

          <div className="status-right">
            <ToolbarButton
              icon={Undo}
              title="Undo (Ctrl+Z)"
              onClick={handleUndo}
              disabled={disabled || historyIndex <= 0}
              className="status-history-btn"
            />
            <ToolbarButton
              icon={Redo}
              title="Redo (Ctrl+Y)"
              onClick={handleRedo}
              disabled={disabled || historyIndex >= history.length - 1}
              className="status-history-btn"
            />
          </div>
        </div>
      </div>

      <LinkModal 
        isOpen={isLinkModalOpen} 
        onClose={() => setIsLinkModalOpen(false)} 
        onInsert={handleInsertLink} 
        theme={theme} 
      />
    </>
  );
};

export default memo(BlogEditor);