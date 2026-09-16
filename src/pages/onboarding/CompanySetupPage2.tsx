import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, MessageSquare, Mail, Globe, Check, Save } from 'lucide-react';
import Button from '@/components/Button';

export default function CompanySetupPage2() {
  const navigate = useNavigate();

  const [selectedChannels, setSelectedChannels] = useState<string[]>(['WhatsApp', 'Web']);

  const channelOptions = [
    {
      id: 'WhatsApp',
      name: 'WhatsApp',
      desc: 'Connect with customers instantly through WhatsApp conversations.',
      color: 'bg-emerald-500',
      border: 'border-emerald-200',
      bg: 'bg-emerald-50',
      icon: Smartphone,
    },
    {
      id: 'Messenger',
      name: 'Messenger',
      desc: 'Engage with customers using Facebook Messenger support.',
      color: 'bg-blue-600',
      border: 'border-blue-200',
      bg: 'bg-blue-50',
      icon: MessageSquare,
    },
    {
      id: 'SMS',
      name: 'SMS',
      desc: 'Send and receive SMS messages directly through Omni Channels.',
      color: 'bg-purple-600',
      border: 'border-purple-200',
      bg: 'bg-purple-50',
      icon: Smartphone,
    },
    {
      id: 'Email',
      name: 'Email',
      desc: 'Manage customer emails directly in your workspace.',
      color: 'bg-pink-500',
      border: 'border-pink-200',
      bg: 'bg-pink-50',
      icon: Mail,
    },
  ];

  const toggleChannel = (id: string) => {
    if (selectedChannels.includes(id)) {
      setSelectedChannels(selectedChannels.filter((ch) => ch !== id));
    } else {
      setSelectedChannels([...selectedChannels, id]);
    }
  };

  const handleSave = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      <div className="relative z-10 max-w-5xl w-full bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-slate-200">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Set up Your Company Details
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
            Setup and edit Your Company Details here to Continue
          </p>
        </div>

        {/* Section Title */}
        <div className="mb-6">
          <h2 className="text-lg font-extrabold text-indigo-600 flex items-center gap-2">
            <span>* Needed Omni Channels</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select The Omni Channels You want to active Your Company
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {channelOptions.map((ch) => {
            const isSelected = selectedChannels.includes(ch.id);
            return (
              <div
                key={ch.id}
                onClick={() => toggleChannel(ch.id)}
                className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${ch.bg} ${
                  isSelected ? 'border-indigo-600 shadow-lg ring-2 ring-indigo-500/20' : `${ch.border} opacity-80 hover:opacity-100`
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${ch.color} text-white shadow-md`}>
                      <ch.icon className="w-6 h-6" />
                    </div>
                    {isSelected && (
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1">{ch.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal mb-6">
                    {ch.desc}
                  </p>
                </div>

                <button
                  type="button"
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                    isSelected ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  {isSelected ? 'CHANNEL ACTIVE' : 'AVAILABLE PLAN'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom Action Button */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={handleSave}
            className="rounded-xl px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </Button>
        </div>

      </div>
    </div>
  );
}
