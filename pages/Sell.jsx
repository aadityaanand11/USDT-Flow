
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Clock, Sparkles, Shield, Wallet, ArrowDownLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import SellForm from "../components/trade/SellForm";
import DepositInstructions from "../components/wallet/DepositInstructions";
import PinVerification from "../components/security/PinVerification";
import BiometricPrompt from "../components/security/BiometricPrompt";
// Assuming react-router-dom is used for navigation

// Placeholder for createPageUrl function. In a real app, this would be a utility or come from a routing config.
const createPageUrl = (pageName) => {
  switch (pageName) {
    case "Kyc": // Changed from "KYC" to "Kyc" to match the intended call site
      return "/kyc-verification"; // Example path for KYC page
    // Add other cases as needed
    default:
      return "/";
  }
};

export default function Sell() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [showPinVerification, setShowPinVerification] = useState(false);
  const [showBiometric, setShowBiometric] = useState(false);
  const [pendingTrade, setPendingTrade] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentRate, setCurrentRate] = useState(88.45); // Initial realistic rate
  const [walletBalance, setWalletBalance] = useState(0);
  const [kycStatus, setKycStatus] = useState(null); // New state for KYC status
  const [loadingKyc, setLoadingKyc] = useState(true); // New state for KYC loading

  // Function to simulate fetching a live rate
  const fetchLiveRate = () => {
    setCurrentRate(prev => {
      // Generate a small random change, positive or negative
      const change = (Math.random() - 0.5) * 0.3; // Change between -0.15 and +0.15

      // Apply change and ensure rate stays within a realistic range
      const newRate = prev + change;
      return Math.max(87.5, Math.min(89.5, newRate)); // Rate stays between 87.5 and 89.5
    });
  };

  useEffect(() => {
    checkKYCStatus(); // Check KYC status on component mount
    loadWalletBalance();

    // Fetch initial live rate and then set up interval for updates
    fetchLiveRate();
    const interval = setInterval(fetchLiveRate, 60000); // Update every 60 seconds

    return () => clearInterval(interval);
  }, []);

  const checkKYCStatus = async () => {
    try {
      const user = await base44.auth.me();
      // Assuming KYCVerification entity has a 'created_by' field that matches user's email
      const kycRecords = await base44.entities.KYCVerification.filter({ created_by: user.email });
      if (kycRecords.length > 0) {
        setKycStatus(kycRecords[0]); // Assuming one KYC record per user is relevant
      } else {
        setKycStatus(null); // No KYC record found means not submitted
      }
    } catch (error) {
      console.error('Error checking KYC:', error);
      // Handle error state, e.g., set a specific status or message
      setKycStatus({ status: 'error', message: 'Failed to load KYC status.' });
    }
    setLoadingKyc(false);
  };

  const loadWalletBalance = async () => {
    try {
      const user = await base44.auth.me();
      const wallets = await base44.entities.Wallet.filter({ created_by: user.email });

      if (wallets.length > 0) {
        setWalletBalance(wallets[0].balance_usdt || 0);
      } else {
        setWalletBalance(0); // If no wallet found for user
      }
    } catch (error) {
      console.error('Error loading wallet:', error);
      setWalletBalance(0); // Ensure balance is 0 on error
    }
  };

  const handleSell = async (sellData) => {
    // Check KYC before proceeding with the sell operation
    if (!kycStatus || kycStatus.status !== 'approved') {
      let errorMessage = 'KYC verification required! Please complete your KYC to sell USDT.';
      if (kycStatus?.status === 'under_review') {
        errorMessage = 'Your KYC documents are under review. Please wait for approval to sell USDT.';
      } else if (kycStatus?.status === 'rejected') {
        errorMessage = 'Your KYC was rejected. Please resubmit with correct documents to sell USDT.';
      }

      setResult({
        type: 'error',
        message: errorMessage
      });
      return; // Stop the sell process
    }

    setPendingTrade(sellData);

    // Randomly decide between PIN verification and biometric prompt
    if (Math.random() > 0.5) {
      setShowBiometric(true);
    } else {
      setShowPinVerification(true);
    }
  };

  const handleSecurityVerified = async (verified) => {
    // Close security prompts
    setShowPinVerification(false);
    setShowBiometric(false);

    if (!verified || !pendingTrade) {
      setResult({
        type: 'error',
        message: 'Security verification failed or no pending trade.'
      });
      setPendingTrade(null);
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      // Create transaction
      const transaction = await base44.entities.Transaction.create({
        ...pendingTrade,
        type: 'sell',
        status: 'completed'
      });

      // Update wallet balance
      const user = await base44.auth.me();
      const wallets = await base44.entities.Wallet.filter({ created_by: user.email });

      if (wallets.length > 0) {
        const wallet = wallets[0];
        await base44.entities.Wallet.update(wallet.id, {
          balance_usdt: wallet.balance_usdt - pendingTrade.amount_usdt,
          total_withdrawn: (wallet.total_withdrawn || 0) + pendingTrade.amount_usdt
        });
      }

      setTimeout(() => {
        setResult({
          type: 'success',
          message: `USDT Sold successfully! 🎉 ₹${pendingTrade.net_amount.toFixed(2)} will be transferred to your bank. Transaction ID: ${transaction.id.slice(0, 8).toUpperCase()}`,
          transaction
        });
        setShowConfetti(true);
        loadWalletBalance();
        setTimeout(() => {
          setShowConfetti(false);
        }, 3000);
        setIsProcessing(false);
      }, 800); // Simulate a brief processing time

    } catch (error) {
      console.error('Transaction error:', error);
      setResult({
        type: 'error',
        message: 'Sale failed. Please try again or contact support.'
      });
      setIsProcessing(false);
    }

    setPendingTrade(null);
  };

  // Conditional rendering for KYC status checks
  if (loadingKyc) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Checking verification status...</p>
        </div>
      </div>
    );
  }

  if (!kycStatus || kycStatus.status !== 'approved') {
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 shadow-xl">
            <CardContent className="p-8 text-center">
              <Shield className="w-20 h-20 text-amber-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">KYC Verification Required</h2>
              <p className="text-slate-700 mb-6">
                {kycStatus?.status === 'under_review'
                  ? 'Your KYC documents are under review. This usually takes 24-48 hours. You will be able to trade once approved.'
                  : kycStatus?.status === 'rejected'
                  ? 'Your KYC was rejected. Please complete verification via the Dashboard.'
                  : 'You need to complete KYC verification before you can sell USDT. Please visit the Dashboard to begin verification.'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main component rendering if KYC is approved
  return (
    <div className="p-4 md:p-8 space-y-8 relative">
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

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-2 flex items-center gap-2"
          >
            <ArrowDownLeft className="w-10 h-10 text-red-600" />
            Sell USDT
            <Sparkles className="w-8 h-8 text-yellow-500" />
          </motion.h1>
          <p className="text-slate-600 font-medium">Convert your USDT to INR instantly at live market rates</p>
        </div>

        {/* Wallet Balance Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 border-2 border-purple-300 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <Wallet className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Your Wallet Balance</p>
                    <p className="text-3xl font-bold text-slate-900">{walletBalance.toFixed(6)} USDT</p>
                    <p className="text-sm text-slate-600">≈ ₹{(walletBalance * currentRate).toFixed(2)}</p>
                  </div>
                </div>
                <Button
                  onClick={loadWalletBalance}
                  variant="outline"
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

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
            <DepositInstructions onDepositConfirmed={loadWalletBalance} />
            <SellForm
              onSubmit={handleSell}
              isProcessing={isProcessing}
              currentRate={currentRate}
              walletBalance={walletBalance}
            />
          </div>

          <div className="space-y-6">
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-red-600 animate-pulse" />
                      <div>
                        <p className="font-bold text-slate-900">Processing Sale</p>
                        <p className="text-sm text-slate-600">Almost done...</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            <Card className="bg-white border-slate-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-900 font-bold">Sale Information</CardTitle>
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
                    <span className="text-slate-600">Min Amount</span>
                    <span className="font-medium text-slate-900">₹100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Payout Time</span>
                    <span className="font-medium text-slate-900">Instant to Bank</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-900 font-bold flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Secure Process
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-700 space-y-2 font-medium">
                <p>1. Deposit USDT to your wallet</p>
                <p>2. Wait for confirmation (TRC20: ~1 min)</p>
                <p>3. Sell instantly at live rates</p>
                <p>4. Receive INR in your bank</p>
                <p>5. Track everything in History</p>
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
