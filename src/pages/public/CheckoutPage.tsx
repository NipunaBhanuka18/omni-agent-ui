import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Building2, ShieldCheck, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import InputField from '@/components/InputField';
import Button from '@/components/Button';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
  const [cardHolder, setCardHolder] = useState('John Smith');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('789');
  const [saveCard, setSaveCard] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      navigate('/checkout/success');
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Complete Payment
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">
          Fill in your details and select a payment method to activate your workspace package.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Payment Method */}
        <div className="lg:col-span-8 bg-white/95 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-indigo-100 shadow-2xl shadow-indigo-500/10">
          <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            Payment Method
          </h2>

          {/* Payment Method Switcher Tabs */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`py-3.5 px-4 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                paymentMethod === 'card'
                  ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <CreditCard className="w-4 h-4 text-indigo-600" />
              <span>Credit / Debit Card</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('bank')}
              className={`py-3.5 px-4 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                paymentMethod === 'bank'
                  ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>Online Banking</span>
            </button>
          </div>

          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            {paymentMethod === 'card' ? (
              <>
                <InputField
                  label="Cardholder Name *"
                  placeholder="John Smith"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  required
                />

                <InputField
                  label="Card Number *"
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                  icon={<CreditCard className="w-4 h-4 text-indigo-600" />}
                />

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Expiry Date *"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    required
                  />
                  <InputField
                    label="CVC / CVV *"
                    type="password"
                    placeholder="•••"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    required
                    icon={<Lock className="w-4 h-4 text-slate-400" />}
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    id="saveCard"
                    type="checkbox"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 cursor-pointer"
                  />
                  <label htmlFor="saveCard" className="text-xs font-medium text-slate-600 cursor-pointer select-none">
                    Save this card for future automated payments
                  </label>
                </div>
              </>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-3">
                <p className="font-bold text-slate-900">Supported Banks: Commercial Bank, Sampath Bank, HNB, Nations Trust Bank</p>
                <p>You will be redirected to your secure bank gateway to authorize the payment after clicking below.</p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                256-Bit Encrypted Secure Checkout
              </span>
            </div>
          </form>
        </div>

        {/* Right Card: Order Summary */}
        <div className="lg:col-span-4 bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-4 pb-3 border-b border-slate-800">
              Order Summary
            </h3>

            {/* Selected Plan Box */}
            <div className="p-4 rounded-2xl bg-indigo-950/70 border border-indigo-800/60 mb-6">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 block">
                BUSINESS PLAN
              </span>
              <h4 className="text-sm font-bold text-white mt-1">30-Day Subscription (10 AI Agents)</h4>
              <p className="text-xs text-slate-300 mt-0.5">LKR 4,900.00 / month</p>
            </div>

            {/* Pricing Items */}
            <div className="space-y-3 text-xs font-medium text-slate-300 mb-6 border-b border-slate-800 pb-6">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="text-white font-bold">LKR 4,900.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Taxes & Fees (15%)</span>
                <span className="text-white font-bold">LKR 735.00</span>
              </div>
            </div>

            {/* Total Row */}
            <div className="flex items-baseline justify-between mb-8">
              <span className="text-sm font-bold text-slate-200">Total</span>
              <div className="text-right">
                <span className="text-2xl font-black text-cyan-400 block">LKR 5,635.00</span>
                <span className="text-[10px] text-slate-400 font-normal">Includes VAT & Taxes</span>
              </div>
            </div>
          </div>

          <div>
            <Button
              type="button"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              onClick={handlePaymentSubmit}
              className="rounded-2xl py-3.5 font-bold text-xs bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 hover:scale-[1.02]"
            >
              <span>PURCHASE NOW</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <p className="text-[10px] text-slate-400 text-center mt-3 leading-tight">
              By subscribing you agree to our Terms of Service & Privacy Policy
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
