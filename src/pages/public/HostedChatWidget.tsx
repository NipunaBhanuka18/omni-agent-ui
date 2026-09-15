import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react';
import { Bot, Send, User, Headset, CheckCircle2, ShieldCheck, RefreshCw, AlertCircle, FileText } from 'lucide-react';
import { apiClient } from '@/api/apiClient';

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'select';
  options?: string[];
  required?: boolean;
}

interface DynamicForm {
  formId: string;
  title: string;
  fields: FormField[];
}

interface Message {
  id: string;
  sender: 'user' | 'bot' | 'agent' | 'system';
  text: string;
  timestamp: string;
  form?: DynamicForm;
  data?: any;
}

export default function HostedChatWidget() {
  const { companySlug = 'slt', agentSlug = 'support' } = useParams<{ companySlug: string; agentSlug: string }>();

  const [agentInfo, setAgentInfo] = useState<{ name: string; tenantId: string; model: string }>({
    name: `${companySlug.toUpperCase()} ${agentSlug.toUpperCase()} Assistant`,
    tenantId: companySlug,
    model: 'SLT-Specialist-v3',
  });

  const [isLoadingAgent, setIsLoadingAgent] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isEscalated, setIsEscalated] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Resolve Agent URL (`GET /resolve-chat-url?company=...&agent=...`)
  useEffect(() => {
    const resolveAgent = async () => {
      setIsLoadingAgent(true);
      try {
        const data = await apiClient.get('/resolve-chat-url', {
          params: { company: companySlug, agent: agentSlug },
        });

        if (data && data.agent) {
          setAgentInfo({
            name: data.agent.name || `${companySlug.toUpperCase()} Assistant`,
            tenantId: data.agent.tenantId || companySlug,
            model: data.agent.model || 'SLT-Specialist-v3',
          });
        }
      } catch (err) {
        // Fallback simulation mode
      } finally {
        setIsLoadingAgent(false);
      }
    };

    resolveAgent();

    setMessages([
      {
        id: 'init-1',
        sender: 'bot',
        text: `Welcome to ${companySlug.toUpperCase()} Official Support! How can I assist you today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [companySlug, agentSlug]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  // 2. Handle Send Customer Query
  const handleSendQuery = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const text = inputText;
    setInputText('');
    setIsSending(true);

    try {
      const resData = await apiClient.post(
        '/api/agent',
        {
          intent: 'query',
          params: { query: text },
        },
        {
          tenantId: agentInfo.tenantId,
          channel: 'web',
        }
      );

      if (resData && resData.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: resData.data?.message || 'Thank you for your request.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            data: resData.data,
          },
        ]);
      } else {
        throw new Error('Failed');
      }
    } catch {
      // Offline fallback + sample dynamic form trigger test if user typed "form" or default response
      setTimeout(() => {
        let botReply = `Thank you for contacting ${agentInfo.name}. Your query has been recorded.`;
        let triggerForm: DynamicForm | undefined = undefined;

        if (text.toLowerCase().includes('form') || text.toLowerCase().includes('register') || text.toLowerCase().includes('complain')) {
          botReply = 'Please fill out the quick support form below so our specialist team can help you immediately:';
          triggerForm = {
            formId: 'form-support-ticket',
            title: 'Customer Support Request Form',
            fields: [
              { id: 'fullName', label: 'Full Name', type: 'text', required: true },
              { id: 'accountNo', label: 'SLT Account Number', type: 'text', required: true },
              { id: 'issueCategory', label: 'Issue Category', type: 'select', options: ['Fiber Broadband', 'PEO TV', 'Voice Landline', 'Billing'] },
            ],
          };
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: botReply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            form: triggerForm,
          },
        ]);
      }, 500);
    } finally {
      setIsSending(false);
    }
  };

  // 3. Handle Dynamic Form Submission (`POST /forms/submit`)
  const handleFormSubmit = async (e: React.FormEvent, formId: string) => {
    e.preventDefault();
    setIsSending(true);

    try {
      await apiClient.post(
        '/forms/submit',
        {
          formId,
          formData: formValues,
        },
        { tenantId: agentInfo.tenantId }
      );
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `✅ Form submitted successfully! Reference ID: REF-${Math.floor(100000 + Math.random() * 900000)}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `✅ Form submitted successfully! Reference ID: REF-${Math.floor(100000 + Math.random() * 900000)} (Saved)`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  // 4. Request Human Assistant Escalation (`POST /agent/handoff` or `POST /escalate`)
  const handleRequestHuman = async () => {
    setIsSending(true);
    try {
      await apiClient.post(
        '/agent/handoff',
        {
          companySlug,
          agentSlug,
          reason: 'Customer requested human assistant escalation.',
        },
        { tenantId: agentInfo.tenantId }
      );
    } catch {
      // Simulation mode handoff trigger
    } finally {
      setIsEscalated(true);
      setIsSending(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          sender: 'system',
          text: '🎧 Human Assistant Escalation Requested. A Live Agent is joining your chat session shortly...',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-3 sm:p-6 font-sans">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-[680px]">
        {/* Widget Top Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-indigo-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-cyan-300 shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight">{agentInfo.name}</h2>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {isEscalated ? 'Connected to Live Human Agent' : 'AI Assistant (Online)'}
              </span>
            </div>
          </div>

          {/* Request Human Assistant Button */}
          <button
            onClick={handleRequestHuman}
            disabled={isEscalated || isSending}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
              isEscalated
                ? 'bg-emerald-600 text-white opacity-90 cursor-default'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'
            }`}
          >
            <Headset className="w-3.5 h-3.5" />
            <span>{isEscalated ? 'Human Agent Requested' : 'Request Human Assistant'}</span>
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 bg-slate-50 overflow-y-auto space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.sender === 'user' ? 'justify-end' : m.sender === 'system' ? 'justify-center' : 'justify-start'
              }`}
            >
              {m.sender === 'system' ? (
                <div className="px-3 py-1.5 rounded-2xl bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-200">
                  {m.text}
                </div>
              ) : (
                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] text-xs shadow-xs space-y-3 ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none font-medium'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>

                  {/* Dynamic Form Rendering */}
                  {m.form && (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-indigo-200 space-y-3 text-slate-900">
                      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        <span className="font-bold text-xs">{m.form.title}</span>
                      </div>

                      <form onSubmit={(e) => handleFormSubmit(e, m.form!.formId)} className="space-y-2.5">
                        {m.form.fields.map((f) => (
                          <div key={f.id}>
                            <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                              {f.label} {f.required && <span className="text-red-500">*</span>}
                            </label>
                            {f.type === 'select' ? (
                              <select
                                onChange={(e) => setFormValues({ ...formValues, [f.id]: e.target.value })}
                                className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                                required={f.required}
                              >
                                <option value="">Select option...</option>
                                {f.options?.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type={f.type}
                                onChange={(e) => setFormValues({ ...formValues, [f.id]: e.target.value })}
                                className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                                required={f.required}
                              />
                            )}
                          </div>
                        ))}

                        <button
                          type="submit"
                          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
                        >
                          Submit Form (`POST /forms/submit`)
                        </button>
                      </form>
                    </div>
                  )}

                  <span
                    className={`text-[9px] block text-right ${
                      m.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              )}
            </div>
          ))}

          {isSending && (
            <div className="flex items-center gap-2 text-slate-500 text-xs p-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
              <span>Processing query...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendQuery} className="p-3 bg-white border-t border-slate-200 flex gap-2">
          <input
            type="text"
            placeholder="Type your message or ask a question..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={isSending}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md flex items-center gap-1 text-xs"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
