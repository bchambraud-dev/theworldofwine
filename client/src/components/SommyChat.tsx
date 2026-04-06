import { useState, useRef, useEffect, useCallback } from "react";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  "What should I drink tonight?",
  "Explain tannins to me",
  "Best wine with steak?",
  "I'm new to wine — where do I start?",
];

export default function SommyChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      const userMessage: Message = { role: "user", content: text.trim() };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput("");
      setIsStreaming(true);
      setStreamingText("");

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: newMessages }),
        });

        if (!response.ok) throw new Error("Chat request failed");

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response stream");

        const decoder = new TextDecoder();
        let fullText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.text) {
                  fullText += data.text;
                  setStreamingText(fullText);
                }
                if (data.done) {
                  setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: fullText },
                  ]);
                  setStreamingText("");
                }
                if (data.error) {
                  setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: data.error },
                  ]);
                  setStreamingText("");
                }
              } catch {}
            }
          }
        }
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Sorry, I'm having trouble connecting right now. Give me a moment and try again.",
          },
        ]);
        setStreamingText("");
      }

      setIsStreaming(false);
    },
    [messages, isStreaming]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          data-testid="sommy-chat-toggle"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "#8C1C2E",
            color: "#F7F4EF",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 20px rgba(140,28,46,0.3)",
            transition: "transform 0.2s, box-shadow 0.2s",
            zIndex: 1000,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.08)";
            e.currentTarget.style.boxShadow = "0 6px 28px rgba(140,28,46,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(140,28,46,0.3)";
          }}
        >
          {/* The Drop icon (simplified) */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C12 2 6 10 6 15C6 18.3 8.7 21 12 21C15.3 21 18 18.3 18 15C18 10 12 2 12 2Z"
              fill="currentColor"
              opacity="0.9"
            />
          </svg>
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            right: 0,
            width: "100%",
            maxWidth: 420,
            height: "min(600px, 85vh)",
            background: "#F7F4EF",
            borderTopLeftRadius: 20,
            borderTopRightRadius: window.innerWidth > 420 ? 20 : 0,
            boxShadow: "0 -4px 40px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1001,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #EDEAE3",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "#8C1C2E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C12 2 6 10 6 15C6 18.3 8.7 21 12 21C15.3 21 18 18.3 18 15C18 10 12 2 12 2Z"
                    fill="#F7F4EF"
                  />
                </svg>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: "1rem",
                    fontWeight: 500,
                    color: "#1A1410",
                    lineHeight: 1.2,
                  }}
                >
                  Ask Sommy
                </div>
                <div
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 300,
                    color: "#5A5248",
                  }}
                >
                  Your wine companion
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              data-testid="sommy-chat-close"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 8,
                color: "#5A5248",
                fontSize: 20,
                lineHeight: 1,
              }}
            >
              &#x2715;
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {/* Welcome message */}
            {messages.length === 0 && !isStreaming && (
              <div>
                <div
                  style={{
                    background: "#EDEAE3",
                    borderRadius: "16px 16px 16px 4px",
                    padding: "14px 18px",
                    maxWidth: "85%",
                    marginBottom: 16,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: "0.9rem",
                      fontWeight: 300,
                      color: "#1A1410",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    Hey, I'm Sommy. I spend most of my time thinking about wine
                    so you don't have to. Ask me anything — what to drink, what
                    to pair, what that weird smell in your glass is. No wrong
                    questions here.
                  </p>
                </div>

                {/* Quick prompts */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      data-testid={`quick-prompt-${prompt.slice(0, 20)}`}
                      style={{
                        background: "white",
                        border: "1px solid #D4D1CA",
                        borderRadius: 20,
                        padding: "8px 14px",
                        fontFamily: "'Jost', sans-serif",
                        fontSize: "0.8rem",
                        fontWeight: 400,
                        color: "#8C1C2E",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#8C1C2E";
                        e.currentTarget.style.color = "#F7F4EF";
                        e.currentTarget.style.borderColor = "#8C1C2E";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "white";
                        e.currentTarget.style.color = "#8C1C2E";
                        e.currentTarget.style.borderColor = "#D4D1CA";
                      }}
                    >
                      {prompt}
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
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    background:
                      msg.role === "user" ? "#8C1C2E" : "#EDEAE3",
                    color: msg.role === "user" ? "#F7F4EF" : "#1A1410",
                    borderRadius:
                      msg.role === "user"
                        ? "16px 16px 4px 16px"
                        : "16px 16px 16px 4px",
                    padding: "12px 16px",
                    maxWidth: "85%",
                    fontFamily: "'Jost', sans-serif",
                    fontSize: "0.9rem",
                    fontWeight: 300,
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Streaming indicator */}
            {isStreaming && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    background: "#EDEAE3",
                    borderRadius: "16px 16px 16px 4px",
                    padding: "12px 16px",
                    maxWidth: "85%",
                    fontFamily: "'Jost', sans-serif",
                    fontSize: "0.9rem",
                    fontWeight: 300,
                    lineHeight: 1.6,
                    color: "#1A1410",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {streamingText || (
                    <span style={{ color: "#5A5248", opacity: 0.6 }}>
                      Sommy is thinking...
                    </span>
                  )}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            style={{
              padding: "12px 16px",
              borderTop: "1px solid #EDEAE3",
              display: "flex",
              gap: 8,
              flexShrink: 0,
              background: "#F7F4EF",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about wine..."
              disabled={isStreaming}
              data-testid="sommy-chat-input"
              style={{
                flex: 1,
                border: "1px solid #D4D1CA",
                borderRadius: 24,
                padding: "10px 18px",
                fontFamily: "'Jost', sans-serif",
                fontSize: "0.9rem",
                fontWeight: 300,
                color: "#1A1410",
                background: "white",
                outline: "none",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#8C1C2E";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#D4D1CA";
              }}
            />
            <button
              type="submit"
              disabled={isStreaming || !input.trim()}
              data-testid="sommy-chat-send"
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                background:
                  isStreaming || !input.trim() ? "#D4D1CA" : "#8C1C2E",
                color: "#F7F4EF",
                border: "none",
                cursor:
                  isStreaming || !input.trim() ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "background 0.15s",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
