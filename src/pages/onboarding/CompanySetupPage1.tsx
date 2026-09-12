import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Upload, Globe, Mail, Phone, MapPin, ArrowRight, Image as ImageIcon } from 'lucide-react';
import InputField from '@/components/InputField';
import Button from '@/components/Button';

export default function CompanySetupPage1() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: 'ABC Company (Pvt) Ltd',
    website: 'https://abc.com',
    adminEmail: 'admin@abc.com',
    address: 'No 45, Galle Road, Colombo 03',
    phone: '+94 77 1234 567',
    companyType: 'Technology',
    bio: 'Leading digital transformation and AI agent enterprise solutions provider.',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/onboarding/channels');
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Brand Identity & Logo Upload */}
            <div className="md:col-span-4 bg-slate-50 p-6 rounded-3xl border border-slate-200 flex flex-col items-center text-center">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4" />
                Brand Identity
              </span>

              <div className="w-36 h-36 rounded-2xl bg-white border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-4 mb-4 shadow-sm group hover:border-indigo-500 transition-colors">
                <ImageIcon className="w-10 h-10 text-slate-300 group-hover:text-indigo-500 transition-colors mb-2" />
                <span className="text-[10px] font-semibold text-slate-400">Upload Your Company Logo</span>
              </div>

              <button
                type="button"
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md flex items-center gap-2"
              >
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>Upload Logo</span>
              </button>
            </div>

            {/* Right Column: Form Inputs */}
            <div className="md:col-span-8 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Company Name *"
                  placeholder="Acme Corp"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  icon={<Building2 className="w-4 h-4 text-slate-400" />}
                  required
                />

                <InputField
                  label="Company Website URL"
                  placeholder="https://company.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  icon={<Globe className="w-4 h-4 text-slate-400" />}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Admin Email *"
                  type="email"
                  placeholder="admin@company.com"
                  value={formData.adminEmail}
                  onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                  icon={<Mail className="w-4 h-4 text-slate-400" />}
                  required
                />

                <InputField
                  label="Company Contact Number *"
                  placeholder="+94 77 1234 567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  icon={<Phone className="w-4 h-4 text-slate-400" />}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Company Street Address"
                  placeholder="123 Main Street"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  icon={<MapPin className="w-4 h-4 text-slate-400" />}
                />

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Type of Your Company *
                  </label>
                  <select
                    value={formData.companyType}
                    onChange={(e) => setFormData({ ...formData, companyType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Finance">Finance</option>
                    <option value="Education">Education</option>
                    <option value="Health Care">Health Care</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  About the Company (Corporate Bio)
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your company requirements..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                />
              </div>
            </div>

          </div>

          {/* Bottom Action Button */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="rounded-xl px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-2"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
}
