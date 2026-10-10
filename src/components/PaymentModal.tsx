import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  CreditCard, 
  Smartphone, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  Sparkles,
  Download,
  Receipt,
  FileCheck,
  Building2,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PaymentMethod, Transaction } from '../types';

export const PaymentModal: React.FC = () => {
  const { 
    selectedCourseForPayment, 
    closePaymentModal, 
    enrollInCourse,
    currentUser 
  } = useApp();

  // Default to M-Pesa for Kenyan users
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mpesa');
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // M-Pesa state
  const [mpesaPhone, setMpesaPhone] = useState('+254 712 345 678');
  const [mpesaStage, setMpesaStage] = useState<'idle' | 'prompt_sent' | 'pin_verified'>('idle');

  // Card state
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('789');
  const [cardHolder, setCardHolder] = useState(currentUser?.name || 'Felix Siloma');
  
  // Airtel Money state
  const [airtelPhone, setAirtelPhone] = useState('+254 733 123 456');

  // Processing & Completed
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTxn, setCompletedTxn] = useState<Transaction | null>(null);

  if (!selectedCourseForPayment) return null;

  const originalPrice = selectedCourseForPayment.price;
  const discountedPrice = Math.max(0, originalPrice * (1 - discountPercent / 100));
  const finalPrice = Math.round(discountedPrice);

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'STUDENT50') {
      setDiscountPercent(50);
      setCouponMessage({ text: '50% Architectural Scholarship Applied! Saved Ksh ' + Math.round(originalPrice * 0.5).toLocaleString(), isError: false });
    } else if (code === 'SCHOLAR100' || code === 'HYCLASSFREE') {
      setDiscountPercent(100);
      setCouponMessage({ text: '100% Full Academic Grant Applied! Free Studio Access.', isError: false });
    } else {
      setCouponMessage({ text: 'Invalid code. Try STUDENT50 or SCHOLAR100', isError: true });
    }
  };

  const handlePay = () => {
    setIsProcessing(true);

    if (paymentMethod === 'mpesa') {
      setMpesaStage('prompt_sent');
      setTimeout(() => {
        setMpesaStage('pin_verified');
        setTimeout(() => {
          const mpesaRef = `SKL${Math.floor(100 + Math.random() * 899)}HJ${Math.floor(10 + Math.random() * 89)}`;
          finalizePayment({ phone: mpesaPhone, mpesaReceipt: mpesaRef });
        }, 1200);
      }, 1500);
    } else {
      setTimeout(() => {
        let details: any = {};
        if (paymentMethod === 'credit_card') {
          details = { last4: cardNumber.slice(-4) || '4242', holder: cardHolder };
        } else if (paymentMethod === 'airtel_money') {
          details = { phone: airtelPhone, mpesaReceipt: `AIRTEL-${Math.floor(10000 + Math.random() * 89999)}` };
        } else if (paymentMethod === 'pesalink') {
          details = { bankReference: `KCB-PESALINK-${Math.floor(1000 + Math.random() * 9000)}` };
        }
        finalizePayment(details);
      }, 1300);
    }
  };

  const finalizePayment = (details: any) => {
    try {
      const res = enrollInCourse(selectedCourseForPayment.id, paymentMethod, details, finalPrice);
      setCompletedTxn(res.transaction);
      setIsProcessing(false);
    } catch {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-xs p-0 sm:p-4">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="relative w-full max-w-xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col"
      >
        {/* Top Header - Oxford Blue */}
        <div className="bg-[#002147] text-white p-5 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Lock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">HYCLASS STUDIO Checkout</h2>
              <div className="flex items-center gap-2 text-xs text-sky-200">
                <span>Kenya Shillings (KES)</span>
                <span aria-hidden="true">·</span>
                <span>Safaricom M-Pesa Integrated</span>
              </div>
            </div>
          </div>
          <button 
            onClick={closePaymentModal}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {completedTxn ? (
            /* Success Screen */
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-4 space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-500">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-[#002147]">Enrollment Confirmed!</h3>
                <p className="text-sm text-slate-600 mt-1">
                  You now have full studio access to <span className="font-semibold text-slate-800">{selectedCourseForPayment.title}</span>.
                </p>
              </div>

              {/* Receipt Card */}
              <div className="bg-[#f0f5fa] border border-[#d2e0f0] rounded-2xl p-4 text-left space-y-3 font-sans">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Official Kenyan Academic Receipt</span>
                  <span className="text-xs font-mono font-medium text-[#002147]">{completedTxn.receiptNumber}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block">Student:</span>
                    <span className="font-semibold text-slate-800">{completedTxn.studentName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Date & Time:</span>
                    <span className="font-medium text-slate-800">{new Date(completedTxn.timestamp).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Payment Method:</span>
                    <span className="font-medium capitalize text-slate-800">
                      {completedTxn.paymentMethod === 'mpesa' ? 'Safaricom M-Pesa' : completedTxn.paymentMethod.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Amount Paid:</span>
                    <span className="font-bold text-[#002147] font-mono">KES {completedTxn.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={closePaymentModal}
                  className="flex-1 py-3 px-4 bg-[#002147] hover:bg-[#072c59] text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <FileCheck className="w-4 h-4" />
                  Enter Architecture Classroom
                </button>
                <button
                  onClick={() => window.print()}
                  className="py-3 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Print Receipt
                </button>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Course Mini Summary */}
              <div className="flex items-center gap-4 bg-[#f0f5fa] p-3.5 rounded-2xl border border-[#dbe6f5]">
                <img 
                  src={selectedCourseForPayment.thumbnail} 
                  alt={selectedCourseForPayment.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-semibold text-[#002147] uppercase tracking-wide">
                    {selectedCourseForPayment.institution}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {selectedCourseForPayment.title}
                  </h4>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Studio Master: {selectedCourseForPayment.instructorName}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-base sm:text-lg font-black text-[#002147] font-mono">
                    KES {selectedCourseForPayment.price.toLocaleString()}
                  </div>
                  {selectedCourseForPayment.originalPrice && (
                    <div className="text-xs text-slate-400 line-through">
                      KES {selectedCourseForPayment.originalPrice.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Method Selector (Kenyan Gateways) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Kenya Payment Gateway
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'mpesa'
                        ? 'border-[#002147] bg-[#f0f5fa] text-[#002147] font-bold ring-2 ring-[#002147]/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs">M-Pesa (STK)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'credit_card'
                        ? 'border-[#002147] bg-[#f0f5fa] text-[#002147] font-bold ring-2 ring-[#002147]/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#002147]" />
                    <span className="text-xs">Visa / Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('airtel_money')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'airtel_money'
                        ? 'border-[#002147] bg-[#f0f5fa] text-[#002147] font-bold ring-2 ring-[#002147]/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                      A
                    </div>
                    <span className="text-xs">Airtel Money</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pesalink')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'pesalink'
                        ? 'border-[#002147] bg-[#f0f5fa] text-[#002147] font-bold ring-2 ring-[#002147]/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-blue-700" />
                    <span className="text-xs">PesaLink / Bank</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Input based on Gateway */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                {paymentMethod === 'mpesa' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
                      <div className="flex items-center gap-2 font-bold text-emerald-800">
                        <Smartphone className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Safaricom M-Pesa Daraja STK Push</span>
                      </div>
                      <div className="text-[11px] text-emerald-700">
                        Paybill: <span className="font-mono font-bold">522522</span> · Account: <span className="font-mono font-bold">HS-ARCH</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Safaricom M-Pesa Mobile Number
                      </label>
                      <input 
                        type="tel"
                        value={mpesaPhone}
                        onChange={e => setMpesaPhone(e.target.value)}
                        placeholder="+254 7XX XXX XXX"
                        className="w-full text-sm bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-mono focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>

                    {mpesaStage === 'prompt_sent' && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 animate-pulse flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                        <span>STK Push prompt sent for KES {finalPrice.toLocaleString()}! Enter your 4-digit M-Pesa PIN on your phone handset...</span>
                      </div>
                    )}

                    {mpesaStage === 'pin_verified' && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>M-Pesa PIN verified! Safaricom receipt reference generated.</span>
                      </div>
                    )}
                  </div>
                )}

                {paymentMethod === 'credit_card' && (
                  <div className="space-y-3">
                    <div className="text-xs text-slate-500">
                      Supports Visa / Mastercard from Equity Bank, KCB, Stanbic, Absa, NCBA, and international cards.
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Cardholder Name</label>
                      <input 
                        type="text"
                        value={cardHolder}
                        onChange={e => setCardHolder(e.target.value)}
                        className="w-full text-sm bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:border-[#002147]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Card Number</label>
                      <div className="relative">
                        <input 
                          type="text"
                          value={cardNumber}
                          onChange={e => setCardNumber(e.target.value)}
                          className="w-full text-sm bg-white border border-slate-300 rounded-xl px-3 py-2 pl-10 text-slate-800 font-mono focus:outline-hidden focus:border-[#002147]"
                        />
                        <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Expiry Date</label>
                        <input 
                          type="text"
                          value={cardExpiry}
                          onChange={e => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full text-sm bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-mono focus:outline-hidden focus:border-[#002147]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">CVC / CVV</label>
                        <input 
                          type="password"
                          value={cardCvc}
                          onChange={e => setCardCvc(e.target.value)}
                          maxLength={4}
                          className="w-full text-sm bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-mono focus:outline-hidden focus:border-[#002147]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'airtel_money' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Airtel Money Registered Phone</label>
                      <input 
                        type="tel"
                        value={airtelPhone}
                        onChange={e => setAirtelPhone(e.target.value)}
                        placeholder="+254 733 XXX XXX"
                        className="w-full text-sm bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-mono focus:outline-hidden focus:border-red-600"
                      />
                    </div>
                    <p className="text-xs text-slate-500">
                      You will receive an Airtel Money prompt to confirm payment of KES {finalPrice.toLocaleString()}.
                    </p>
                  </div>
                )}

                {paymentMethod === 'pesalink' && (
                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                      <div className="font-bold text-[#002147]">Interbank Transfer via PesaLink</div>
                      <div>Account: <span className="font-mono font-bold">1102948201</span> (KCB Bank Kenya)</div>
                      <div>Account Name: <span className="font-bold">Hyclass Studio Architecture Ltd</span></div>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Transfer KES {finalPrice.toLocaleString()} instantly via your local banking mobile app.
                    </p>
                  </div>
                )}
              </div>

              {/* Coupon / Scholarship Code */}
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    placeholder="Coupon (e.g. STUDENT50 or SCHOLAR100)"
                    className="flex-1 text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 uppercase font-mono tracking-wider focus:outline-hidden focus:border-[#002147]"
                  />
                  <button 
                    type="button"
                    onClick={applyCoupon}
                    className="px-3.5 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p className={`text-xs ${couponMessage.isError ? 'text-rose-600' : 'text-emerald-700 font-medium'}`}>
                    {couponMessage.text}
                  </p>
                )}
              </div>

              {/* Total Calculation in KES */}
              <div className="border-t border-slate-200 pt-3 space-y-1 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal Studio Tuition</span>
                  <span className="font-mono">KES {originalPrice.toLocaleString()}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Scholarship Grant (-{discountPercent}%)</span>
                    <span className="font-mono">-KES {Math.round((originalPrice * discountPercent) / 100).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-[#002147] pt-1">
                  <span>Total Due Today</span>
                  <span className="font-mono text-lg font-black text-[#002147]">KES {finalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Pay Button */}
              <button
                type="button"
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 bg-[#002147] hover:bg-[#072c59] disabled:bg-slate-300 text-white font-bold rounded-2xl transition-all shadow-lg shadow-[#002147]/20 flex items-center justify-center gap-2 text-sm"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Secure Gateway...</span>
                  </div>
                ) : (
                  <>
                    <span>Enroll & Pay KES {finalPrice.toLocaleString()}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>30-Day Money-Back Academic Guarantee · Accredited Certificate</span>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
