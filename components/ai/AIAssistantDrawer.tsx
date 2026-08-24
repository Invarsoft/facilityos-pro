'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { UserCheck, X, Send, User, HelpCircle, Ticket, Phone, Wrench } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  actionButtons?: { label: string; href?: string; actionType?: string }[];
}

export const AIAssistantDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { activeOrg, tickets, createTicket, aiDrawerOpen, setAiDrawerOpen } = useApp();
  const [inputQuery, setInputQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialMessages: ChatMessage[] = [
    {
      id: 'msg-1',
      sender: 'bot',
      text: `Hello! I'm **FacilityOS Operations Assistant**, your service helper for **${activeOrg.name}**. How can I assist you with service requests, tracking, or maintenance procedures today?`,
      timestamp: 'Just now',
      actionButtons: [
        { label: '➕ Raise New Request', href: '/requests/new' },
        { label: '📋 View Active Tickets', href: '/my-requests' },
        { label: '🚨 Report Emergency', actionType: 'emergency' },
      ],
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen && !aiDrawerOpen) return null;

  const handleClose = () => {
    onClose();
    setAiDrawerOpen(false);
  };

  // Generate intelligent response based on keywords
  const processUserQuery = (query: string) => {
    const q = query.toLowerCase();
    let botReplyText = '';
    let buttons: { label: string; href?: string; actionType?: string }[] | undefined = undefined;

    if (q.includes('leak') || q.includes('water') || q.includes('tap') || q.includes('plumb')) {
      botReplyText = `💧 **Plumbing Diagnostic**: Tap or pipe leakage detected.\n\nOur average SLA for plumbing resolution at **${activeOrg.name}** is **${
        activeOrg.type === 'university' ? '24 Hours' : '12 Hours'
      }**. Would you like me to open a service request wizard for you?`;
      buttons = [{ label: '➕ Raise Plumbing Request', href: '/requests/new?category=plumbing' }];
    } else if (q.includes('ac') || q.includes('cool') || q.includes('hvac') || q.includes('hot')) {
      botReplyText = `❄️ **HVAC Diagnostic**: AC cooling or airflow issue reported.\n\nAssigned technician team handles indoor unit filter cleaning and gas pressure checks. SLA limit: **24 Hours**.`;
      buttons = [{ label: '➕ Raise AC Service Request', href: '/requests/new?category=ac_hvac' }];
    } else if (q.includes('wifi') || q.includes('internet') || q.includes('net') || q.includes('connect')) {
      botReplyText = `📶 **Wi-Fi / Network Support**: High priority network ticket.\n\nIT Support team checks access point status and router ports. Average SLA: **8 Hours**.`;
      buttons = [{ label: '➕ Report Wi-Fi Issue', href: '/requests/new?category=wifi_network' }];
    } else if (q.includes('status') || q.includes('ticket') || q.includes('track')) {
      const activeCount = tickets.filter((t) => t.status !== 'closed').length;
      botReplyText = `📋 You currently have **${activeCount} active request(s)** in the portal. You can view real-time technician progress on your requests dashboard.`;
      buttons = [{ label: '📂 Go to My Requests', href: '/my-requests' }];
    } else if (q.includes('emergency') || q.includes('fire') || q.includes('short') || q.includes('spark')) {
      botReplyText = `🚨 **EMERGENCY DISPATCH TRIGGERED**\n\nHigh-priority emergency alerts dispatch immediate notifications to the facility manager and quick-response on-call technicians!`;
      buttons = [{ label: '🚨 Open Emergency Modal', actionType: 'emergency' }];
    } else {
      botReplyText = `Thank you for contacting **${activeOrg.name} Helpdesk**. Our maintenance team is available 24/7. You can raise a request directly or track existing tickets.`;
      buttons = [
        { label: '➕ New Request', href: '/requests/new' },
        { label: '📋 Track Tickets', href: '/my-requests' },
      ];
    }

    setMessages((prev) => [
      ...prev,
      {
        id: 'msg-' + Date.now(),
        sender: 'bot',
        text: botReplyText,
        timestamp: 'Just now',
        actionButtons: buttons,
      },
    ]);
    setIsTyping(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userText = inputQuery.trim();
    setInputQuery('');

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: 'msg-' + Date.now(),
        sender: 'user',
        text: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    setIsTyping(true);
    setTimeout(() => {
      processUserQuery(userText);
    }, 600);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-violet-700 to-indigo-700 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white shadow-inner">
            <UserCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold flex items-center gap-2">
              <span>FacilityOS Assistant</span>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-white/20">
                ACTIVE
              </span>
            </h3>
            <p className="text-[11px] text-violet-200">{activeOrg.name} Dispatch Support Desk</p>
          </div>
        </div>

        <button
          onClick={handleClose}
          className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Messages Body */}
      <div className="p-4 flex-1 overflow-y-auto space-y-4 bg-slate-50 dark:bg-slate-950/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-start gap-2 max-w-[88%]">
              {msg.sender === 'bot' && (
                <div className="w-7 h-7 rounded-lg bg-violet-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <UserCheck className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none font-medium'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Optional Quick Action Buttons */}
                {msg.actionButtons && msg.actionButtons.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-1.5">
                    {msg.actionButtons.map((btn, idx) => (
                      <a
                        key={idx}
                        href={btn.href || '#'}
                        onClick={() => handleClose()}
                        className="px-2.5 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-950/60 hover:bg-violet-100 dark:hover:bg-violet-900/80 text-violet-700 dark:text-violet-300 font-bold text-[11px] border border-violet-200 dark:border-violet-800/80 transition-all flex items-center gap-1"
                      >
                        <span>{btn.label}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <div className="w-6 h-6 rounded-lg bg-violet-600/30 flex items-center justify-center">
              <UserCheck className="w-3.5 h-3.5 text-violet-500 animate-pulse" />
            </div>
            <span>Assistant is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box Form */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask operations support or describe an issue..."
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim()}
          className="p-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white shadow-md transition-all shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
