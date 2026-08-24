'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Bot, X, Send, User, HelpCircle, Ticket, Phone } from 'lucide-react';

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
      text: `Hello! I'm **Facos Bot**, your intelligent operations assistant for **${activeOrg.name}**. How can I assist you with service requests, tracking, or maintenance procedures today?`,
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

  // Generate intelligent Facos Bot response based on keywords
  const processUserQuery = (query: string) => {
    const q = query.toLowerCase();
    let botReplyText = '';
    let buttons: { label: string; href?: string; actionType?: string }[] | undefined = undefined;

    if (q.includes('leak') || q.includes('water') || q.includes('tap') || q.includes('plumb')) {
      botReplyText = `💧 **Plumbing Diagnostic**: Tap or pipe leakage detected.\n\nOur average SLA for plumbing resolution at **${activeOrg.name}** is **${
        activeOrg.type === 'university' ? '24 Hours' : '12 Hours'
      }**. Would you like me to open a service request wizard for you?`;
      buttons = [
        { label: '🔧 Open Plumbing Request Wizard', href: '/requests/new?serviceId=plumbing' },
        { label: '📞 Call Helpdesk', href: `tel:${activeOrg.contactPhone}` },
      ];
    } else if (q.includes('ac') || q.includes('cool') || q.includes('hvac') || q.includes('fan')) {
      botReplyText = `❄️ **HVAC Diagnostic**: AC cooling or fan regulator issue.\n\nFacos Bot recommends checking if the power circuit breaker is tripped before raising a ticket.`;
      buttons = [
        { label: '❄️ Report AC / Cooling Issue', href: '/requests/new?serviceId=ac_hvac' },
      ];
    } else if (q.includes('status') || q.includes('track') || q.includes('my ticket') || q.includes('progress')) {
      const activeCount = tickets.filter((t) => t.status !== 'closed' && t.status !== 'resolved').length;
      botReplyText = `📊 You currently have **${activeCount} active request(s)** in **${activeOrg.name}**. All work orders are monitored by Facos Bot for SLA compliance.`;
      buttons = [{ label: 'View My Requests', href: '/my-requests' }];
    } else if (q.includes('emergency') || q.includes('fire') || q.includes('danger') || q.includes('spark')) {
      botReplyText = `🚨 **EMERGENCY PROTOCOL ACTIVATED**: For immediate life-safety or structural hazards, Facos Bot can dispatch an emergency response team.`;
      buttons = [{ label: '🚨 Trigger Emergency Dispatch', actionType: 'emergency' }];
    } else {
      botReplyText = `🤖 **Facos Bot Response**: I can help you register service requests, track technician arrivals, or answer facility queries for **${activeOrg.name}**. What would you like to do next?`;
      buttons = [
        { label: 'Raise Service Request', href: '/requests/new' },
        { label: 'Browse Facility Directory', href: '/organizations' },
      ];
    }

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text: botReplyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionButtons: buttons,
        },
      ]);
    }, 600);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: inputQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const queryCopy = inputQuery;
    setInputQuery('');
    processUserQuery(queryCopy);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center font-bold text-white shadow-md shadow-violet-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
              <span>FacilityOS Facos Bot</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                ONLINE
              </span>
            </h3>
            <p className="text-[10px] text-slate-300">Intelligent Operations & Diagnostics Bot</p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="p-1.5 rounded-lg text-slate-300 hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-start gap-2 max-w-[85%]">
              {msg.sender === 'bot' && (
                <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-1">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Action Buttons if present */}
                {msg.actionButtons && msg.actionButtons.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700/80 space-y-1.5">
                    {msg.actionButtons.map((btn, idx) => (
                      <a
                        key={idx}
                        href={btn.href || '#'}
                        onClick={() => {
                          if (!btn.href) handleClose();
                        }}
                        className="block w-full py-1.5 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-[11px] font-bold text-center text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
                      >
                        {btn.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic">
            <Bot className="w-4 h-4 text-violet-500 animate-spin" />
            <span>Facos Bot is calculating diagnostics...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Footer */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask Facos Bot about facility issues..."
            className="flex-1 py-2 px-3 rounded-xl bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium"
          />
          <button
            type="submit"
            className="p-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold transition-all shadow-md shadow-violet-600/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
