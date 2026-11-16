import type { ReactNode } from "react";

/**
 * The retro window frame from Abdul's Figma design: grey title bar, three dots, file name on the right.
 *  - `tabs`: page buttons under the title bar (used when a screen has several pages).
 *  - `tone`: "dark" for the dark screens.
 *  - `flush`: the content handles its own padding and backgrounds (full-width images and bands).
 */
export function Window({
  file,
  onClose,
  tone = "cream",
  flush = false,
  tabs,
  activeTab = 0,
  onTab,
  className = "",
  children,
}: {
  file: string;
  onClose?: () => void;
  tone?: "cream" | "dark";
  flush?: boolean;
  tabs?: string[];
  activeTab?: number;
  onTab?: (index: number) => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`window ${tone === "dark" ? "is-dark" : ""} ${className}`}>
      <div className="window-bar">
        <button onClick={onClose} aria-label="Close and go back to the desk" className="window-dot window-close" style={{ background: "#ff5f57" }} />
        <span className="window-dot" style={{ background: "#febc2e" }} />
        <span className="window-dot" style={{ background: "#28c840" }} />
        <span className="window-file">{file}</span>
      </div>
      {tabs && (
        <div className="window-tabs" role="tablist" aria-label="Pages">
          {tabs.map((label, i) => (
            <button key={label} role="tab" aria-selected={i === activeTab} onClick={() => onTab?.(i)} className={`window-tab ${i === activeTab ? "is-active" : ""}`}>
              {label}
            </button>
          ))}
        </div>
      )}
      {/* data-scroll: scrolling here scrolls the window, not the room tour. The key resets scroll when the page changes. */}
      <div key={activeTab} data-scroll className={`window-body ${flush ? "is-flush" : ""}`}>
        {children}
      </div>
    </div>
  );
}
