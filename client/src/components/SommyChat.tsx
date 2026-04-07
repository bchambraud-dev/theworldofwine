import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "wouter";

interface Message {
  role: "user" | "assistant";
  content: string;
}

/** Derive context and quick prompts from the current URL */
function usePageContext() {
  const [location] = useLocation();

  return useMemo(() => {
    // Region page
    const regionMatch = location.match(/\/explore\/region\/([^/]+)/);
    if (regionMatch) {
      const id = regionMatch[1].replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      return {
        context: `The user is currently viewing the ${id} wine region on the map.`,
        chips: [
          `What makes ${id} special?`,
          `Best value wines from ${id}?`,
          `What grapes grow in ${id}?`,
        ],
      };
    }

    // Producer page
    const producerMatch = location.match(/\/explore\/producer\/([^/]+)/);
    if (producerMatch) {
      const id = producerMatch[1].replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      return {
        context: `The user is currently viewing the producer ${id}.`,
        chips: [
          `Tell me about ${id}`,
          `What's their flagship wine?`,
          `Similar producers I should know?`,
        ],
      };
    }

    // Guide page
    const guideMatch = location.match(/\/guides\/([^/]+)/);
    if (guideMatch && guideMatch[1] !== "grapes") {
      const id = guideMatch[1].replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      return {
        context: `The user is currently reading the guide: "${id}".`,
        chips: [
          `Explain this in simple terms`,
          `What's the key takeaway?`,
          `Any common mistakes to avoid?`,
        ],
      };
    }

    // Map/explore page
    if (location.startsWith("/explore")) {
      return {
        context: "The user is exploring the wine map.",
        chips: [
          "Which region should I explore first?",
          "What's the most underrated wine region?",
          "Surprise me with something interesting",
        ],
      };
    }

    // Guides hub
    if (location === "/guides") {
      return {
        context: "The user is browsing the wine guides/academy.",
        chips: [
          "I'm new to wine — where do I start?",
          "What's the most important thing to learn first?",
          "Which guide is the most fun?",
        ],
      };
    }

    // News
    if (location.startsWith("/news")) {
      return {
        context: "The user is reading wine news.",
        chips: [
          "What wine trends should I know about?",
          "Any exciting new regions to watch?",
          "What's happening in the wine world?",
        ],
      };
    }

    // Default (landing, journeys, etc.)
    return {
      context: "",
      chips: [
        "What should I drink tonight?",
        "I'm new to wine — where do I start?",
        "Best wine with steak?",
        "Explain tannins to me",
      ],
    };
  }, [location]);
}

interface SommyChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SommyChat({ isOpen, onClose }: SommyChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { context, chips } = usePageContext();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMessage: Message = { role: "user", content: text.trim() };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput("");
      setIsLoading(true);

      try {
        // Inject page context into the system message via the first user message
        const messagesWithContext = context
          ? [
              { role: "user" as const, content: `[Context: ${context}]\n\n${newMessages[0].content}` },
              ...newMessages.slice(1),
            ]
          : newMessages;

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: messagesWithContext }),
        });

        if (!response.ok) throw new Error("Chat request failed");
        const data = await response.json();

        if (data.text) {
          setMessages(prev => [...prev, { role: "assistant", content: data.text }]);
        } else if (data.error) {
          setMessages(prev => [...prev, { role: "assistant", content: data.error }]);
        }
      } catch {
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Give me a moment and try again." },
        ]);
      }

      setIsLoading(false);
    },
    [messages, isLoading, context]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  if (!isOpen) return null;

  return (
    <div
      className="sommy-panel"
      data-testid="sommy-panel"
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "min(400px, 100vw)",
        height: "100vh",
        background: "var(--bg, #F7F4EF)",
        borderLeft: "1px solid var(--border-c, #D4D1CA)",
        display: "flex",
        flexDirection: "column",
        zIndex: 900,
        boxShadow: "-4px 0 30px rgba(0,0,0,0.08)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 18px",
          borderBottom: "1px solid var(--cream-mid, #EDEAE3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img
            src="/sommy-avatar-circle.png"
            alt="Sommy"
            style={{ width: 38, height: 38, borderRadius: "50%", background: "#EDEAE3" }}
          />
          <div>
            <div
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "1rem",
                fontWeight: 500,
                color: "var(--text, #1A1410)",
                lineHeight: 1.2,
              }}
            >
              Sommy
            </div>
            <div
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "0.72rem",
                fontWeight: 300,
                color: "var(--text2, #5A5248)",
              }}
            >
              Your wine companion
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          data-testid="sommy-close"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
            color: "var(--text2, #5A5248)",
            fontSize: 18,
            lineHeight: 1,
          }}
          aria-label="Close Sommy"
        >
          &#x2715;
        </button>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {/* Welcome + chips when no messages */}
        {messages.length === 0 && !isLoading && (
          <div>
            <div
              style={{
                background: "var(--cream-mid, #EDEAE3)",
                borderRadius: "14px 14px 14px 4px",
                padding: "13px 16px",
                maxWidth: "88%",
                marginBottom: 14,
              }}
            >
              <p
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "0.88rem",
                  fontWeight: 300,
                  color: "var(--text, #1A1410)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                Hey, I'm Sommy. I spend most of my time thinking about wine so you don't have to. Ask me anything — what to drink, what to pair, what that weird smell in your glass is. No wrong questions here.
              </p>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {chips.map(chip => (
                <button
                  key={chip}
                  onClick={() => sendMessage(chip)}
                  data-testid={`chip-${chip.slice(0, 15)}`}
                  style={{
                    background: "white",
                    border: "1px solid var(--border-c, #D4D1CA)",
                    borderRadius: 18,
                    padding: "7px 13px",
                    fontFamily: "'Jost', sans-serif",
                    fontSize: "0.78rem",
                    fontWeight: 400,
                    color: "var(--wine, #8C1C2E)",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "var(--wine, #8C1C2E)";
                    e.currentTarget.style.color = "var(--bg, #F7F4EF)";
                    e.currentTarget.style.borderColor = "var(--wine, #8C1C2E)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "white";
                    e.currentTarget.style.color = "var(--wine, #8C1C2E)";
                    e.currentTarget.style.borderColor = "var(--border-c, #D4D1CA)";
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat messages */}
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                background: msg.role === "user" ? "var(--wine, #8C1C2E)" : "var(--cream-mid, #EDEAE3)",
                color: msg.role === "user" ? "var(--bg, #F7F4EF)" : "var(--text, #1A1410)",
                borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                padding: "11px 15px",
                maxWidth: "88%",
                fontFamily: "'Jost', sans-serif",
                fontSize: "0.88rem",
                fontWeight: 300,
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Loading */}
        {isLoading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div
              style={{
                background: "var(--cream-mid, #EDEAE3)",
                borderRadius: "14px 14px 14px 4px",
                padding: "11px 15px",
                fontFamily: "'Jost', sans-serif",
                fontSize: "0.88rem",
                fontWeight: 300,
                color: "var(--text2, #5A5248)",
                opacity: 0.6,
              }}
            >
              Sommy is thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: "10px 14px",
          borderTop: "1px solid var(--cream-mid, #EDEAE3)",
          display: "flex",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask me anything about wine..."
          disabled={isLoading}
          data-testid="sommy-input"
          style={{
            flex: 1,
            border: "1px solid var(--border-c, #D4D1CA)",
            borderRadius: 22,
            padding: "9px 16px",
            fontFamily: "'Jost', sans-serif",
            fontSize: "0.88rem",
            fontWeight: 300,
            color: "var(--text, #1A1410)",
            background: "white",
            outline: "none",
          }}
          onFocus={e => { e.currentTarget.style.borderColor = "var(--wine, #8C1C2E)"; }}
          onBlur={e => { e.currentTarget.style.borderColor = "var(--border-c, #D4D1CA)"; }}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          data-testid="sommy-send"
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: isLoading || !input.trim() ? "var(--border-c, #D4D1CA)" : "var(--wine, #8C1C2E)",
            color: "var(--bg, #F7F4EF)",
            border: "none",
            cursor: isLoading || !input.trim() ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "background 0.15s",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>
    </div>
  );
}
