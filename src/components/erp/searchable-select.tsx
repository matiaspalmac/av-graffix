"use client";

import { SelectHTMLAttributes, useState, useRef, useEffect } from "react";
import { ChevronDown, Search, X } from "lucide-react";

export interface SelectOption {
  id: string | number;
  name: string;
  [key: string]: string | number | boolean | undefined;
}

interface SearchableSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  description?: string;
  options: SelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  error?: string;
}

export function SearchableSelect({
  label,
  description,
  options,
  placeholder = "Selecciona una opción",
  searchPlaceholder = "Buscar...",
  emptyMessage = "No hay resultados",
  error,
  value,
  onChange,
  name,
  required,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.id === value);

  useEffect(() => {
    const filtered = options.filter((opt) =>
      opt.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchQuery, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (optionId: string | number) => {
    const event = new Event("change", { bubbles: true });
    Object.defineProperty(event, "target", {
      value: { name, value: optionId },
      enumerable: true,
    });
    onChange?.(event as unknown as React.ChangeEvent<HTMLSelectElement>);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleClear = () => {
    const event = new Event("change", { bubbles: true });
    Object.defineProperty(event, "target", {
      value: { name, value: "" },
      enumerable: true,
    });
    onChange?.(event as unknown as React.ChangeEvent<HTMLSelectElement>);
  };

  return (
    <div className="grid gap-1.5" ref={containerRef}>
      {label && (
        <label className="text-sm">
          <span className="text-zinc-600 dark:text-zinc-300">{label}</span>
          {required && <span className="text-red-600 dark:text-red-400 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full rounded-xl border bg-transparent px-3 py-2 text-left flex items-center justify-between transition ${
            error
              ? "border-red-300 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20"
              : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600"
          }`}
        >
          <span className={selectedOption ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500"}>
            {selectedOption?.name || placeholder}
          </span>
          <div className="flex items-center gap-1">
            {selectedOption && value && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded p-1"
              >
                <X size={16} />
              </button>
            )}
            <ChevronDown
              size={18}
              className={`transition ${isOpen ? "rotate-180" : ""}`}
            />
          </div>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg z-50">
            <div className="p-2">
              <div className="relative">
                <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent pl-8 pr-3 py-1.5 text-sm placeholder-zinc-500 dark:placeholder-zinc-400"
                />
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto border-t border-zinc-200 dark:border-zinc-800">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
                  {emptyMessage}
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelect(option.id)}
                    className={`w-full px-3 py-2 text-left text-sm transition ${
                      value === option.id
                        ? "bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-100"
                        : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {option.name}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {description && !error && (
        <p className="text-xs text-zinc-600 dark:text-zinc-400">{description}</p>
      )}

      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
