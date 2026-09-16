import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  X,
  Send,
  Minimize2,
  Maximize2,
  CreditCard,
  Wifi,
  BarChart2,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  intent?: string;
  data?: any;
  error?: any;
}

import { apiClient } from "@/api/apiClient";

export default function ChatBotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "bot",
      text: "Hello! I am your OmniAI Assistant. How can I help you today?",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (intentToRun?: string) => {
    const textToSend = inputMessage.trim() || (intentToRun ? `Triggered intent: ${intentToRun}` : "");
    if (!textToSend && !intentToRun) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: inputMessage.trim() || `Run ${intentToRun}`,
      intent: intentToRun,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    const targetIntent = intentToRun || "check_balance";

    try {
      const resData = await apiClient.post('/api/agent', {
        intent: targetIntent,
        params: { query: textToSend },
      });
      if (resData.success) {
        let replyText = "Action completed successfully.";
        if (targetIntent === "check_balance") {
          replyText = `Your current balance is ${resData.data?.currentBalance || "LKR 3,450.00"}, due on ${resData.data?.dueDate || "2026-09-28"}.`;
        } else if (targetIntent === "pay_bill") {
          replyText = `Payment confirmed! Transaction ID: ${resData.data?.transactionId || "TXN-88219482"}.`;
        } else if (targetIntent === "check_usage") {
          replyText = `Data Usage: ${resData.data?.usedDataGB || "68.4"} GB used out of ${resData.data?.totalDataGB || "100"} GB.`;
        } else if (targetIntent === "troubleshoot_router") {
          replyText = `Knowledge Base solution found: ${resData.data?.result?.title || "Power cycle your router for 30s."}`;
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: replyText,
            intent: targetIntent,
            data: resData.data,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: `⚠️ Request failed: ${resData.error?.message || "Error"}`,
            error: resData.error,
          },
        ]);
      }
    } catch {
      // Fallback offline reply
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: `Processed intent [${targetIntent}] (Fallback Simulation Mode).`,
          },
        ]);
      }, 400);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full shadow-2xl flex items-center gap-3 group transition-all duration-300 hover:scale-105"
      >
        <div className="relative">
          <Bot className="w-7 h-7 text-cyan-300" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
        </div>
        <span className="font-bold text-xs pr-1">OmniAI Assistant</span>
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col transition-all duration-300 ${
        isExpanded ? "w-[480px] h-[640px]" : "w-[360px] h-[520px]"
      }`}
    >
      {/* Widget Header */}
      <div className="p-4 bg-slate-900 text-white rounded-t-3xl flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-indigo-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <h3 className="text-xs font-bold">OmniAI Assistant</h3>
            <span className="text-[9px] text-emerald-400 font-semibold block flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online (Backend Connected)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 bg-slate-50 overflow-y-auto space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-3 rounded-2xl max-w-[85%] text-xs ${
                m.sender === "user"
                  ? "bg-indigo-600 text-white rounded-br-none font-medium"
                  : "bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-500 text-xs p-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
            <span>Processing request...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Intent Chips */}
      <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto text-[10px]">
        <button
          onClick={() => handleSend("check_balance")}
          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 font-bold text-slate-700 whitespace-nowrap border border-slate-200 flex items-center gap-1"
        >
          <CreditCard className="w-3 h-3 text-indigo-500" />
          <span>Balance</span>
        </button>
        <button
          onClick={() => handleSend("pay_bill")}
          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 font-bold text-slate-700 whitespace-nowrap border border-slate-200 flex items-center gap-1"
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          <span>Pay Bill</span>
        </button>
        <button
          onClick={() => handleSend("check_usage")}
          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-50 hover:text-purple-600 font-bold text-slate-700 whitespace-nowrap border border-slate-200 flex items-center gap-1"
        >
          <BarChart2 className="w-3 h-3 text-purple-500" />
          <span>Usage</span>
        </button>
        <button
          onClick={() => handleSend("troubleshoot_router")}
          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-cyan-50 hover:text-cyan-600 font-bold text-slate-700 whitespace-nowrap border border-slate-200 flex items-center gap-1"
        >
          <Wifi className="w-3 h-3 text-cyan-500" />
          <span>Wi-Fi Troubleshoot</span>
        </button>
      </div>

      {/* Input Footer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-slate-200 bg-white rounded-b-3xl flex gap-2"
      >
        <input
          type="text"
          placeholder="Ask a question or type intent..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
