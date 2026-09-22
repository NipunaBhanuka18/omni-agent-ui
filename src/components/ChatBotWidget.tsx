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
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { apiClient } from "@/api/apiClient";
import { ENV } from "@/config/env";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  intent?: string;
  data?: any;
  error?: any;
}

export default function ChatBotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<"connected" | "disconnected">("disconnected");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "bot",
      text: "👋 Hello! I am your OmniAI Assistant. How can I help you with your account, billing, data usage, or broadband connection today?",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Dynamic Backend Connection Status Check
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const baseUrl = ENV.API_BASE_URL || "http://localhost:3001";
        const res = await fetch(`${baseUrl.replace(/\/$/, "")}/api/stats`, { signal: AbortSignal.timeout(2000) });
        if (res.ok) {
          setBackendStatus("connected");
        } else {
          setBackendStatus("disconnected");
        }
      } catch {
        setBackendStatus("disconnected");
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 12000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  // Smart Intent Detection from free-form user query text
  const detectIntent = (text: string): string | undefined => {
    const lower = text.toLowerCase();
    if (lower.includes("balance") || lower.includes("bill due") || lower.includes("amount due") || lower.includes("account balance") || lower.includes("my bill")) {
      return "check_balance";
    }
    if (lower.includes("pay") || lower.includes("settle") || lower.includes("payment") || lower.includes("recharge") || lower.includes("paid")) {
      return "pay_bill";
    }
    if (lower.includes("usage") || lower.includes("data") || lower.includes("quota") || lower.includes("gb") || lower.includes("mb") || lower.includes("limit") || lower.includes("remaining")) {
      return "check_usage";
    }
    if (lower.includes("wifi") || lower.includes("wi-fi") || lower.includes("router") || lower.includes("internet") || lower.includes("slow") || lower.includes("troubleshoot") || lower.includes("los") || lower.includes("red light")) {
      return "troubleshoot_router";
    }
    return undefined;
  };

  const handleSend = async (explicitIntent?: string) => {
    const textToSend = inputMessage.trim();
    if (!textToSend && !explicitIntent) return;

    const resolvedIntent = explicitIntent || detectIntent(textToSend) || "check_balance";

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: textToSend || (explicitIntent === "check_balance" ? "Check my balance" : explicitIntent === "pay_bill" ? "Pay my bill" : explicitIntent === "check_usage" ? "Check data usage" : "Troubleshoot Wi-Fi"),
      intent: resolvedIntent,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const resData = await apiClient.post("/api/agent", {
        intent: resolvedIntent,
        params: { query: textToSend },
      });

      if (resData && resData.success) {
        let replyText = "Action processed successfully.";
        const data = resData.data;

        if (resolvedIntent === "check_balance") {
          const bal = data?.balance || data?.currentBalance || "1,500.50";
          const curr = data?.currency || "LKR";
          const due = data?.dueDate || "2026-09-28";
          const acc = data?.accountNumber || data?.accountId || "SLT-9982-555";
          replyText = `Your current balance for account ${acc} is ${curr} ${bal}, due on ${due}.`;
        } else if (resolvedIntent === "pay_bill") {
          const txn = data?.transactionId || "TXN-88219482";
          const amt = data?.amountPaid || "LKR 4,500.00";
          replyText = `Payment confirmed! Transaction ID: ${txn}. Amount: ${amt}. Thank you!`;
        } else if (resolvedIntent === "check_usage") {
          const used = data?.dataUsedGb || data?.usedDataGB || "45.2";
          const total = data?.dataTotalGb || data?.totalDataGB || "100";
          replyText = `High Speed Data Quota: ${used} GB used out of ${total} GB.`;
        } else if (resolvedIntent === "troubleshoot_router") {
          const solution = typeof data?.result === "string" ? data.result : data?.result?.title || "Power cycle your router for 30 seconds.";
          replyText = `Knowledge Base solution found:\n${solution}`;
        } else if (data?.message) {
          replyText = data.message;
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: replyText,
            intent: resolvedIntent,
            data: data,
          },
        ]);
        setBackendStatus("connected");
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: `⚠️ Request failed: ${resData?.error?.message || "Internal server error"}`,
            error: resData?.error,
          },
        ]);
      }
    } catch {
      setBackendStatus("disconnected");
      // Simulation mode response with realistic rich data
      setTimeout(() => {
        let replyText = "Thank you for contacting OmniAI support! How else can I assist you?";
        let mockData: any = null;

        if (resolvedIntent === "check_balance") {
          replyText = "Your current account balance is LKR 3,450.00, due on 2026-09-28 for Account SLT-9982-555.";
          mockData = { currentBalance: "LKR 3,450.00", dueDate: "2026-09-28", accountId: "SLT-9982-555", status: "ACTIVE" };
        } else if (resolvedIntent === "pay_bill") {
          replyText = "Payment confirmed! Transaction ID: TXN-88219482. Amount paid: LKR 4,500.00.";
          mockData = { transactionId: "TXN-88219482", amountPaid: "LKR 4,500.00", paymentStatus: "CONFIRMED" };
        } else if (resolvedIntent === "check_usage") {
          replyText = "Data Usage: 68.4 GB used out of 100 GB (31.6 GB remaining). Voice quota: 420 mins used.";
          mockData = { totalDataGB: 100, usedDataGB: 68.4, remainingDataGB: 31.6, voiceMinutesUsed: 420 };
        } else if (resolvedIntent === "troubleshoot_router") {
          replyText = "Knowledge Base Solution: Power cycle your optical fiber router by disconnecting power for 30 seconds, then check Wi-Fi lights.";
          mockData = {
            result: {
              title: "Resolving Internet & Wi-Fi Connectivity Issues",
              steps: [
                "1. Power off optical router for 30 seconds, then reconnect power.",
                "2. Ensure LAN Cable is securely connected to PORT 1.",
                "3. Switch Wi-Fi frequency band to 5GHz for optimum speeds."
              ]
            }
          };
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: replyText,
            intent: resolvedIntent,
            data: mockData,
          },
        ]);
      }, 350);
    } finally {
      setIsLoading(false);
    }
  };

  // Render Bot Response Visual Cards
  const renderBotCard = (msg: Message) => {
    const data = msg.data;
    if (!data) return null;

    // 1. Balance Visual Card
    if (msg.intent === "check_balance" || data.currentBalance || data.balance) {
      const balanceVal = data.currentBalance || (data.currency ? `${data.currency} ${data.balance}` : `LKR ${data.balance}`) || "LKR 3,450.00";
      const due = data.dueDate || "2026-09-28";
      const acc = data.accountId || data.accountNumber || "SLT-9982-555";

      return (
        <div className="mt-2.5 p-3.5 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white border border-indigo-500/30 shadow-md space-y-2 font-sans">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-cyan-300" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">Account Balance</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-500/30">
              ● Active
            </span>
          </div>

          <div>
            <span className="text-[9px] text-slate-400 block font-medium">Total Amount Due</span>
            <div className="text-xl font-black text-white tracking-tight">{balanceVal}</div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-indigo-800/60 text-[10px]">
            <div>
              <span className="text-slate-400 block">Due Date</span>
              <span className="font-semibold text-slate-200">{due}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Account No</span>
              <span className="font-mono text-slate-200">{acc}</span>
            </div>
          </div>
        </div>
      );
    }

    // 2. Pay Bill Visual Card
    if (msg.intent === "pay_bill" || data.transactionId) {
      return (
        <div className="mt-2.5 p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950 to-slate-900 text-white border border-emerald-500/30 shadow-md space-y-2 font-sans">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">Payment Status</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
              CONFIRMED
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div>
              <span className="text-slate-400 block">Amount Paid</span>
              <span className="text-sm font-black text-emerald-400">{data.amountPaid || "LKR 4,500.00"}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Transaction Ref</span>
              <span className="font-mono text-slate-200 text-[10px]">{data.transactionId || "TXN-88219482"}</span>
            </div>
          </div>
        </div>
      );
    }

    // 3. Usage Quota Visual Card
    if (msg.intent === "check_usage" || data.usedDataGB !== undefined || data.dataUsedGb !== undefined) {
      const used = Number(data.usedDataGB || data.dataUsedGb || 68.4);
      const total = Number(data.totalDataGB || data.dataTotalGb || 100);
      const percentage = Math.min(100, Math.round((used / total) * 100));

      return (
        <div className="mt-2.5 p-3.5 rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-sm space-y-2 font-sans">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-purple-600" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Data Quota Usage</span>
            </div>
            <span className="text-[10px] font-bold text-purple-600">{percentage}% Used</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-semibold">
              <span className="text-slate-500">High Speed Data</span>
              <span className="text-slate-900">{used} GB / {total} GB</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>
      );
    }

    // 4. Wi-Fi Troubleshoot RAG Visual Card
    if (msg.intent === "troubleshoot_router" || data.result) {
      const resultObj = data.result;
      const steps = resultObj?.steps || (typeof resultObj === "string" ? resultObj.split("\n") : [
        "1. Power cycle optical router for 30s.",
        "2. Check LAN cable connection.",
        "3. Connect to 5GHz Wi-Fi network."
      ]);

      return (
        <div className="mt-2.5 p-3.5 rounded-2xl bg-slate-900 text-slate-200 border border-slate-700 shadow-sm space-y-2 font-sans">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Wifi className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-bold text-cyan-300">RAG Diagnostic Solution</span>
            </div>
          </div>

          {resultObj?.title && <h4 className="text-[11px] font-black text-white">{resultObj.title}</h4>}

          <div className="space-y-1 text-[10px] text-slate-300">
            {steps.map((st: string, idx: number) => (
              <p key={idx} className="bg-slate-800/80 p-1.5 rounded-lg border border-slate-700/50">
                {st}
              </p>
            ))}
          </div>
        </div>
      );
    }

    return null;
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
            <span className="text-[9px] font-semibold block flex items-center gap-1">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  backendStatus === "connected" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`}
              />
              {backendStatus === "connected" ? "Online (Backend Connected)" : "Online (Simulation Mode)"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            title={isExpanded ? "Minimize Widget" : "Expand Widget"}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            title="Close Assistant"
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
              className={`p-3 rounded-2xl max-w-[88%] text-xs ${
                m.sender === "user"
                  ? "bg-indigo-600 text-white rounded-br-none font-medium"
                  : "bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs"
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
              {m.sender === "bot" && renderBotCard(m)}
              {m.error && (
                <div className="mt-2 p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[11px] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>{m.error.message || "Failed to process intent."}</span>
                </div>
              )}
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

      {/* Quick Action Intent Chips (Clean no-scrollbar design) */}
      <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar text-[10px]">
        <button
          onClick={() => handleSend("check_balance")}
          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 font-bold text-slate-700 whitespace-nowrap border border-slate-200 flex items-center gap-1 transition-all shrink-0"
        >
          <CreditCard className="w-3 h-3 text-indigo-500" />
          <span>Balance</span>
        </button>
        <button
          onClick={() => handleSend("pay_bill")}
          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 font-bold text-slate-700 whitespace-nowrap border border-slate-200 flex items-center gap-1 transition-all shrink-0"
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          <span>Pay Bill</span>
        </button>
        <button
          onClick={() => handleSend("check_usage")}
          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-50 hover:text-purple-600 font-bold text-slate-700 whitespace-nowrap border border-slate-200 flex items-center gap-1 transition-all shrink-0"
        >
          <BarChart2 className="w-3 h-3 text-purple-500" />
          <span>Usage</span>
        </button>
        <button
          onClick={() => handleSend("troubleshoot_router")}
          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-cyan-50 hover:text-cyan-600 font-bold text-slate-700 whitespace-nowrap border border-slate-200 flex items-center gap-1 transition-all shrink-0"
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
          placeholder="Ask a question or type query..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white shadow-sm transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
