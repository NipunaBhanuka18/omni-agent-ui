import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  Send,
  RefreshCw,
  Sliders,
  CreditCard,
  Wifi,
  BarChart2,
  Code,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Zap,
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot" | "system";
  text: string;
  intent?: string;
  channel?: string;
  timestamp: string;
  data?: any;
  error?: any;
  rawResponse?: any;
}

export default function ChatBotPlayground() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedIntent, setSelectedIntent] = useState<string>("check_balance");
  const [channel, setChannel] = useState<"web" | "whatsapp" | "messenger" | "sms">("web");
  const [tenantId, setTenantId] = useState("dev-tenant-local");
  const [authToken, setAuthToken] = useState("dev-token-staff");
  const [sessionId, setSessionId] = useState(`sess-${Math.random().toString(36).substring(7)}`);
  const [conversationId, setConversationId] = useState(`conv-${Math.random().toString(36).substring(7)}`);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showJsonInspector, setShowJsonInspector] = useState<Record<string, boolean>>({});
  const [backendStatus, setBackendStatus] = useState<"connected" | "disconnected" | "checking">("checking");
  const [customParams, setCustomParams] = useState<string>('{"query": "slow internet connection"}');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Check Backend Server Health
  useEffect(() => {
    const checkServer = async () => {
      const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      if (!isLocalhost && !import.meta.env.VITE_API_URL) {
        setBackendStatus("disconnected");
        return;
      }

      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);

        const res = await fetch(`${apiUrl}/api/registrations`, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
          setBackendStatus("connected");
        } else {
          setBackendStatus("disconnected");
        }
      } catch {
        setBackendStatus("disconnected");
      }
    };

    checkServer();
    const interval = setInterval(checkServer, 15000);
    return () => clearInterval(interval);
  }, []);

  // Initial Welcome Message
  useEffect(() => {
    setMessages([
      {
        id: "welcome-1",
        sender: "bot",
        text: "👋 Welcome to OmniAI ChatBot Service! I am connected to the backend microservice router. Select an intent below or type a query to test.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        channel: "web",
      },
    ]);
  }, []);

  const toggleJsonInspector = (msgId: string) => {
    setShowJsonInspector((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  // Helper to construct intent params based on user intent
  const getIntentParams = (intent: string, userInput: string) => {
    let parsedCustom: any = {};
    try {
      if (customParams.trim()) parsedCustom = JSON.parse(customParams);
    } catch {
      // ignore JSON parse error
    }

    switch (intent) {
      case "check_balance":
        return { accountId: "ACC-994821", ...parsedCustom };
      case "pay_bill":
        return { accountId: "ACC-994821", amount: 4500, paymentMethod: "Credit Card", ...parsedCustom };
      case "check_usage":
        return { accountId: "ACC-994821", period: "current_month", ...parsedCustom };
      case "troubleshoot_router":
        return { query: userInput || parsedCustom.query || "slow internet", routerModel: "ZTE H108N", ...parsedCustom };
      default:
        return { query: userInput, ...parsedCustom };
    }
  };

  // Main Function to execute request to backend
  const handleSend = async (overrideIntent?: string) => {
    const intentToRun = overrideIntent || selectedIntent;
    const textToSend = inputMessage.trim() || `Execute Intent: ${intentToRun}`;

    if (!textToSend && !overrideIntent) return;

    const userMsgId = `user-${Date.now()}`;
    const newMsg: Message = {
      id: userMsgId,
      sender: "user",
      text: inputMessage.trim() ? inputMessage : `Triggered intent: [${intentToRun}]`,
      intent: intentToRun,
      channel: channel,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage("");
    setIsLoading(true);

    const payloadParams = getIntentParams(intentToRun, inputMessage);

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${apiUrl}/api/agent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken.startsWith("Bearer ") ? authToken : `Bearer ${authToken}`,
          "x-tenant-id": tenantId,
          "x-channel": channel,
          "x-session-id": sessionId,
          "x-conversation-id": conversationId,
        },
        body: JSON.stringify({
          intent: intentToRun,
          params: payloadParams,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseData = await response.json();
      setBackendStatus("connected");

      const botMsgId = `bot-${Date.now()}`;
      if (responseData.success) {
        let textSummary = `Intent [${intentToRun}] executed successfully.`;
        if (responseData.data) {
          if (responseData.data.message) textSummary = responseData.data.message;
          else if (responseData.data.status) textSummary = `Status: ${responseData.data.status}`;
        }

        setMessages((prev) => [
          ...prev,
          {
            id: botMsgId,
            sender: "bot",
            text: textSummary,
            intent: intentToRun,
            channel: channel,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            data: responseData.data,
            rawResponse: responseData,
          },
        ]);
      } else {
        const errorObj = responseData.error || { message: "Unknown backend error" };
        setMessages((prev) => [
          ...prev,
          {
            id: botMsgId,
            sender: "bot",
            text: `⚠️ Request Failed: ${errorObj.message || "Error processing request"}`,
            intent: intentToRun,
            channel: channel,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            error: errorObj,
            rawResponse: responseData,
          },
        ]);
      }
    } catch (err: any) {
      console.warn("Backend API request error, fallback simulation triggered:", err);
      setBackendStatus("disconnected");

      // Fallback response for offline mode demonstration
      setTimeout(() => {
        const botMsgId = `bot-${Date.now()}`;
        const mockFallbackData = getFallbackMockData(intentToRun);
        setMessages((prev) => [
          ...prev,
          {
            id: botMsgId,
            sender: "bot",
            text: mockFallbackData.summary,
            intent: intentToRun,
            channel: channel,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            data: mockFallbackData.data,
            rawResponse: { success: true, simulated: true, data: mockFallbackData.data },
          },
        ]);
      }, 500);
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackMockData = (intent: string) => {
    switch (intent) {
      case "check_balance":
        return {
          summary: "Account balance retrieved from fallback service.",
          data: {
            accountId: "ACC-994821",
            currentBalance: "LKR 3,450.00",
            dueDate: "2026-09-28",
            accountStatus: "ACTIVE",
          },
        };
      case "pay_bill":
        return {
          summary: "Payment transaction simulated successfully.",
          data: {
            transactionId: "TXN-88219482",
            amountPaid: "LKR 4,500.00",
            paymentStatus: "CONFIRMED",
            receiptUrl: "https://slt.lk/receipts/TXN-88219482.pdf",
          },
        };
      case "check_usage":
        return {
          summary: "Data & Voice usage metrics retrieved.",
          data: {
            totalDataGB: 100,
            usedDataGB: 68.4,
            remainingDataGB: 31.6,
            voiceMinutesUsed: 420,
            smsUsed: 45,
          },
        };
      case "troubleshoot_router":
        return {
          summary: "Knowledge Base search result for network troubleshooting.",
          data: {
            source: "Vector Index (Mocked KB)",
            query: "slow internet",
            result: {
              articleId: "KB-1042",
              title: "Resolving Slow Internet & High Latency",
              steps: [
                "1. Power cycle your fiber optical router for 30 seconds.",
                "2. Verify LAN Cable connection to PORT 1.",
                "3. Perform Wi-Fi frequency shift to 5GHz band.",
              ],
            },
          },
        };
      default:
        return {
          summary: "Request processed by fallback router.",
          data: { result: "Processed default intent" },
        };
    }
  };

  // Render Rich Message Cards
  const renderBotDataCard = (msg: Message) => {
    const data = msg.data;
    if (!data) return null;

    // 1. Balance Card
    if (msg.intent === "check_balance" || data.currentBalance) {
      return (
        <div className="mt-3 p-4 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white border border-indigo-500/30 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">Account Balance</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
              ● Active Account
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">Total Amount Due</span>
            <div className="text-2xl font-black text-white tracking-tight">{data.currentBalance || "LKR 3,450.00"}</div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-indigo-800/60 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block">Due Date</span>
              <span className="font-semibold text-slate-200">{data.dueDate || "2026-09-28"}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Account ID</span>
              <span className="font-semibold text-slate-200">{data.accountId || "ACC-994821"}</span>
            </div>
          </div>
        </div>
      );
    }

    // 2. Pay Bill Card
    if (msg.intent === "pay_bill" || data.transactionId) {
      return (
        <div className="mt-3 p-4 rounded-2xl bg-gradient-to-br from-emerald-950 to-slate-900 text-white border border-emerald-500/30 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">Payment Successful</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
              CONFIRMED
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block">Amount Paid</span>
              <span className="text-lg font-black text-emerald-400">{data.amountPaid || "LKR 4,500.00"}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Transaction Ref</span>
              <span className="font-mono text-slate-200 text-[11px]">{data.transactionId || "TXN-88219482"}</span>
            </div>
          </div>
        </div>
      );
    }

    // 3. Usage Card
    if (msg.intent === "check_usage" || data.usedDataGB !== undefined) {
      const total = data.totalDataGB || 100;
      const used = data.usedDataGB || 68.4;
      const percentage = Math.round((used / total) * 100);

      return (
        <div className="mt-3 p-4 rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-purple-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Data & Voice Quota</span>
            </div>
            <span className="text-xs font-bold text-purple-600">{percentage}% Used</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-500">High Speed Data</span>
              <span className="text-slate-900">{used} GB / {total} GB</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
            <div className="p-2 rounded-xl bg-purple-50 border border-purple-100">
              <span className="text-[10px] text-purple-600 block font-bold">Voice Minutes</span>
              <span className="font-bold text-slate-800">{data.voiceMinutesUsed || 420} mins</span>
            </div>
            <div className="p-2 rounded-xl bg-purple-50 border border-purple-100">
              <span className="text-[10px] text-purple-600 block font-bold">SMS Count</span>
              <span className="font-bold text-slate-800">{data.smsUsed || 45} sent</span>
            </div>
          </div>
        </div>
      );
    }

    // 4. Support / Knowledge Base Card
    if (msg.intent === "troubleshoot_router" || data.result) {
      const kb = data.result || {};
      const steps = kb.steps || [
        "1. Check physical power adapter and router LEDs.",
        "2. Restart Fiber ONU modem.",
        "3. Clear DNS cache on local device.",
      ];

      return (
        <div className="mt-3 p-4 rounded-2xl bg-slate-900 text-slate-200 border border-slate-700 shadow-md space-y-3 font-sans">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="w-5 h-5 text-cyan-400" />
              <span className="text-xs font-bold text-cyan-300">RAG Knowledge Base Solution</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
              {data.source || "Vector Index"}
            </span>
          </div>

          {kb.title && <h4 className="text-xs font-black text-white">{kb.title}</h4>}

          <div className="space-y-1.5 text-xs text-slate-300">
            {steps.map((step: string, idx: number) => (
              <p key={idx} className="bg-slate-800/70 p-2 rounded-xl border border-slate-700/50">
                {step}
              </p>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-[100dvh] sm:h-[calc(100vh-5rem)] flex flex-col font-sans space-y-3 p-1.5 sm:p-4 max-w-7xl mx-auto w-full">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl shadow-lg border border-indigo-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shrink-0">
            <Bot className="w-5 h-5 sm:w-7 sm:h-7 text-cyan-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-base sm:text-xl font-black tracking-tight truncate">OmniAI ChatBot Playground</h1>
              <span
                className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold flex items-center gap-1 shrink-0 ${
                  backendStatus === "connected"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {backendStatus === "connected" ? "Backend Online" : "Offline Simulation"}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
              Live interface for Omni-Channel Backend Router, Specialist Agents, and RAG Support.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              showSettings
                ? "bg-indigo-600 text-white border-indigo-500"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Config</span>
          </button>
          <button
            onClick={() => setMessages([])}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            title="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Config Drawer Header (Collapsible) */}
      {showSettings && (
        <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs shrink-0">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Channel (x-channel)</label>
            <select
              value={channel}
              onChange={(e: any) => setChannel(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="web">Web Widget (web)</option>
              <option value="whatsapp">WhatsApp (whatsapp)</option>
              <option value="messenger">Facebook Messenger (messenger)</option>
              <option value="sms">SMS Network (sms)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Tenant ID (x-tenant-id)</label>
            <input
              type="text"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Auth Token / User Role</label>
            <select
              value={authToken}
              onChange={(e) => setAuthToken(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="dev-token-staff">Staff User (All Access)</option>
              <option value="dev-token-guest">Guest User (Usage Only)</option>
              <option value="dev-token-billing-only">Billing Admin (Billing Only)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Session ID / Conv ID</label>
            <input
              type="text"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[10px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      )}

      {/* Main Chat Display Area */}
      <div className="flex-1 bg-slate-100 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-inner p-3 sm:p-6 overflow-y-auto space-y-3 sm:space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div className="flex items-center gap-2 mb-1 px-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">{msg.sender}</span>
              {msg.channel && (
                <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-600 text-[9px] font-mono uppercase">
                  {msg.channel}
                </span>
              )}
              <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
            </div>

            <div
              className={`max-w-[92%] sm:max-w-[75%] p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl shadow-xs text-xs ${
                msg.sender === "user"
                  ? "bg-indigo-600 text-white rounded-tr-none font-medium"
                  : "bg-white text-slate-800 rounded-tl-none border border-slate-200/80"
              }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

              {/* Render Bot Response Visual Card */}
              {msg.sender === "bot" && renderBotDataCard(msg)}

              {/* Error Banner */}
              {msg.error && (
                <div className="mt-3 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Error Code: {msg.error.code || "FAILED"}</span>
                  </div>
                  <p className="text-[11px] text-rose-700">{msg.error.message}</p>
                </div>
              )}

              {/* Raw JSON Debug Inspector Toggle */}
              {msg.rawResponse && (
                <div className="mt-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => toggleJsonInspector(msg.id)}
                    className="text-[10px] font-mono font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    <Code className="w-3 h-3" />
                    <span>{showJsonInspector[msg.id] ? "Hide Raw JSON" : "View Raw Response JSON"}</span>
                  </button>

                  {showJsonInspector[msg.id] && (
                    <pre className="mt-2 p-3 bg-slate-900 text-cyan-400 rounded-xl text-[10px] font-mono overflow-x-auto border border-slate-800">
                      {JSON.stringify(msg.rawResponse, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-slate-200/80 max-w-xs shadow-xs">
            <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
            <span className="text-xs font-semibold text-slate-600">Routing intent to agent...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Intent Chips Bar */}
      <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200 shadow-xs space-y-2 shrink-0">
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-slate-500 px-1">
          <span className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Quick Intent Actions
          </span>
          <span className="text-indigo-600 font-mono text-[9px] sm:text-[10px]">Active: {selectedIntent}</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => {
              setSelectedIntent("check_balance");
              handleSend("check_balance");
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              selectedIntent === "check_balance"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Check Balance</span>
          </button>

          <button
            onClick={() => {
              setSelectedIntent("pay_bill");
              handleSend("pay_bill");
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              selectedIntent === "pay_bill"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Pay Bill</span>
          </button>

          <button
            onClick={() => {
              setSelectedIntent("check_usage");
              handleSend("check_usage");
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              selectedIntent === "check_usage"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Data Usage</span>
          </button>

          <button
            onClick={() => {
              setSelectedIntent("troubleshoot_router");
              handleSend("troubleshoot_router");
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              selectedIntent === "troubleshoot_router"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>Troubleshoot Wi-Fi</span>
          </button>
        </div>
      </div>

      {/* Input Bar Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200 shadow-md flex items-center gap-2 sm:gap-3 shrink-0"
      >
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Type query or message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="w-full px-3.5 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="px-4 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all shrink-0"
        >
          <span className="hidden sm:inline">Send Query</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
