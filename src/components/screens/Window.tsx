import type { ReactNode } from "react";

/** The retro window frame from Abdul's Figma design: grey title bar, three dots, file name on the right. */
export function Window({
  file,
  onClose,
  dark = false,
  className = "",
  children,
}: {
  file: string;
  onClose?: () => void;
  dark?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`window ${className}`}>
      <div className="window-bar">
        <button onClick={onClose} aria-label="Close and go back to the desk" className="window-dot window-close" style={{ background: "#ff5f57" }} />
        <span className="window-dot" style={{ background: "#febc2e" }} />
        <span className="window-dot" style={{ background: "#28c840" }} />
        <span className="window-file">{file}</span>
      </div>
      {/* data-scroll: scrolling here scrolls the window, not the room tour */}
      <div data-scroll className={`window-body ${dark ? "paper-dark" : ""}`}>
        {children}
      </div>
    </div>
  );
}
