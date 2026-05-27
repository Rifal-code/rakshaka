import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Loader } from 'lucide-react';

/**
 * Professional debounced search input with animated UI.
 * 
 * @param {Object} props
 * @param {string} props.value - Controlled search value
 * @param {(value: string) => void} props.onChange - Called on every keystroke (controlled mode)
 * @param {(value: string) => void} [props.onSearch] - Called after debounce delay with trimmed value
 * @param {string} [props.placeholder] - Placeholder text
 * @param {number} [props.debounceMs] - Debounce delay in milliseconds (default 350)
 * @param {boolean} [props.isLoading] - Show loading spinner
 * @param {string} [props.className] - Additional wrapper class
 * @param {string} [props.id] - Unique id for the input element
 */
export const SearchInput = ({
  value = '',
  onChange,
  onSearch,
  placeholder = 'Cari laporan...',
  debounceMs = 350,
  isLoading = false,
  className = '',
  id = 'search-input',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  // Debounced search callback
  const debouncedSearch = useCallback(
    (searchValue) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onSearch?.(searchValue.trim());
      }, debounceMs);
    },
    [onSearch, debounceMs]
  );

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange?.(newValue);
    debouncedSearch(newValue);
  };

  const handleClear = () => {
    onChange?.('');
    onSearch?.('');
    inputRef.current?.focus();
  };

  // Keyboard shortcut: Ctrl+K or / to focus
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA')) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      // Escape to blur
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className={`relative group ${className}`}>
      {/* Glow ring on focus */}
      <div
        className={`absolute -inset-[1px] rounded-xl bg-gradient-to-r from-cyber-cyan/30 via-cyber-cyan/10 to-cyber-cyan/30 opacity-0 blur-sm transition-opacity duration-300 pointer-events-none ${
          isFocused ? 'opacity-100' : ''
        }`}
      />

      <div className="relative flex items-center">
        {/* Search Icon */}
        <div className="absolute left-3.5 flex items-center pointer-events-none z-10">
          {isLoading ? (
            <Loader className="w-4 h-4 text-cyber-cyan animate-spin" />
          ) : (
            <Search
              className={`w-4 h-4 transition-colors duration-200 ${
                isFocused ? 'text-cyber-cyan' : 'text-slate-500'
              }`}
            />
          )}
        </div>

        {/* Input field */}
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoComplete="off"
          className={`
            w-full pl-10 pr-20 py-2.5 rounded-xl
            bg-cyber-dark/80 border text-sm font-sans
            text-app-text placeholder-slate-500
            transition-all duration-300
            focus:outline-none focus:ring-0
            ${isFocused
              ? 'border-cyber-cyan/50 shadow-sm'
              : 'border-cyber-border hover:border-slate-500'
            }
          `}
        />

        {/* Right side: Clear button + Shortcut badge */}
        <div className="absolute right-3 flex items-center gap-2 z-10">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 rounded-md text-slate-500 hover:text-app-text hover:bg-cyber-lightDark transition-colors duration-150"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          {!value && !isFocused && (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-cyber-lightDark border border-cyber-border text-[10px] font-mono text-slate-500 select-none">
              Ctrl+K
            </kbd>
          )}
        </div>
      </div>
    </div>
  );
};
