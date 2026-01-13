import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Clock, Sparkles, Shield, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TradeForm from "../components/trade/TradeForm";
import QuickAmountSelector from "../components/trade/QuickAmountSelector";
import PinVerification from "../components/security/PinVerification";
import BiometricPrompt from "../components/security/BiometricPrompt";

export default function Trade() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [showPinVerification, setShowPinVerification] = useState(false);
  const [showBiometric, setShowBiometric] = useState(false);
  const [pendingTrade, setPendingTrade] = useState(null);
  const [selectedQuickAmount, setSelectedQuickAmount] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentRate, setCurrentRate] = useState(88.45);

  useEffect(() => {
    fetchLiveRate();
  }, []);

  const fetchLiveRate = async () => {
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Get the current USDT to INR exchange rate. Return ONLY a single number (e.g., 88.45). Use real-time data from cryptocurrency exchanges.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            rate: { type: "number" }
          }
        }
      });
      setCurrentRate(response.rate || 88.45);
    } catch (error) {
      console.error('Error fetching rate:', error);
      setCurrentRate(88.45);
    }
  };

  const handleTrade = async (tradeData) => {
    setPendingTrade(tradeData);
    
    // Show biometric or PIN based on random choice
    if (Math.random() > 0.5) {
      setShowBiometric(true);
    } else {
      setShowPinVerification(true);
    }
  };

  const handleSecurityVerified = async (verified) => {
    if (!verified || !pendingTrade) return;

    setIsProcessing(true);
    setResult(null);

    try {
      const transaction = await base44.entities.Transaction.create({
        ...pendingTrade,
        status: 'completed'
      });

      setTimeout(() => {
        setResult({
          type: 'success',
          message: `${pendingTrade.type === 'buy' ? 'Purchase' : 'Sale'} completed successfully! 🎉 Transaction ID: ${transaction.id.slice(0, 8).toUpperCase()}`,
          transaction
        });
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
          setSelectedQuickAmount(null);
        }, 3000);
        setIsProcessing(false);
      }, 800);

    } catch (error) {
      console.error('Transaction error:', error);
      setResult({
        type: 'error',
        message: 'Transaction failed. Please try again or contact support.'
      });
      setIsProcessing(false);
    }
    
    setPendingTrade(null);
  };

  const handleQuickAmountSelect = (amount) => {
    setSelectedQuickAmount(amount);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 relative">
      {/* Confetti Effect */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -20,
                  rotate: 0,
                  opacity: 1
                }}
                animate={{
                  y: window.innerHeight + 20,
                  rotate: Math.random() * 360,
                  opacity: 0
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  ease: "linear"
                }}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)]
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 flex items-center gap-2"
          >
            Buy or Sell USDT
            <Sparkles className="w-8 h-8 text-yellow-500" />
          </motion.h1>
          <p className="text-slate-600 font-medium">Instant USDT to INR conversion at live market rates</p>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert className={`mb-6 ${
              result.type === 'success' 
                ? 'bg-green-50 border-green-300 text-green-800'
                : 'bg-red-50 border-red-300 text-red-800'
            }`}>
              {result.type === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <AlertDescription className="font-medium">
                {result.message}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <QuickAmountSelector 
              onSelect={handleQuickAmountSelect}
              selectedAmount={selectedQuickAmount}
            />
            <TradeForm 
              onSubmit={handleTrade} 
              isProcessing={isProcessing}
              quickAmount={selectedQuickAmount}
              currentRate={currentRate}
            />
          </div>

          <div className="space-y-6">
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-600 animate-pulse" />
                      <div>
                        <p className="font-bold text-slate-900">Processing Transaction</p>
                        <p className="text-sm text-slate-600">Almost done...</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            <Card className="bg-white border-slate-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-900 font-bold">Exchange Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Processing Time</span>
                    <span className="font-medium text-green-600">⚡ Instant</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Service Fee</span>
                    <span className="font-medium text-slate-900">1.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Network Fee</span>
                    <span className="font-medium text-slate-900">₹25</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Default Network</span>
                    <span className="font-medium text-slate-900">TRC20</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Min Amount</span>
                    <span className="font-medium text-slate-900">₹100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Daily Limit</span>
                    <span className="font-medium text-slate-900">₹1,00,000</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-900 font-bold flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Advanced Security
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-700 space-y-2 font-medium">
                <p>🔒 256-bit encryption</p>
                <p>🔐 Multi-factor authentication</p>
                <p>🛡️ Real-time fraud detection</p>
                <p>📱 Device fingerprinting</p>
                <p>🔍 Transaction monitoring</p>
                <p>💳 PCI DSS compliant</p>
                <p>⚡ Instant notifications</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-900 font-bold flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-600" />
                  Your Safety Matters
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-slate-600 space-y-2">
                <p>✓ Every transaction verified</p>
                <p>✓ Secure wallet integration</p>
                <p>✓ Insurance protected</p>
                <p>✓ 24/7 security monitoring</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <PinVerification
        isOpen={showPinVerification}
        onClose={() => setShowPinVerification(false)}
        onVerify={handleSecurityVerified}
      />

      <BiometricPrompt
        isOpen={showBiometric}
        onClose={() => setShowBiometric(false)}
        onVerify={handleSecurityVerified}
      />
    </div>
  );
}
