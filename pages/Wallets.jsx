import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, CheckCircle, AlertCircle, Building2, Wallet } from "lucide-react";

export default function Wallets() {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [exchangeWallets, setExchangeWallets] = useState([]);
  const [showBankForm, setShowBankForm] = useState(false);
  const [showWalletForm, setShowWalletForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [banks, wallets] = await Promise.all([
        base44.entities.BankAccount.list(),
        base44.entities.ExchangeWallet.list()
      ]);
      setBankAccounts(banks);
      setExchangeWallets(wallets);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const handleAddBankAccount = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      await base44.entities.BankAccount.create({
        account_number: formData.get('account_number'),
        ifsc_code: formData.get('ifsc_code'),
        bank_name: formData.get('bank_name'),
        account_holder_name: formData.get('account_holder_name'),
        is_primary: bankAccounts.length === 0
      });
      setShowBankForm(false);
      loadData();
      e.target.reset();
    } catch (error) {
      console.error('Error adding bank account:', error);
    }
  };

  const handleAddWallet = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      await base44.entities.ExchangeWallet.create({
        exchange: formData.get('exchange'),
        wallet_address: formData.get('wallet_address'),
        network: formData.get('network')
      });
      setShowWalletForm(false);
      loadData();
      e.target.reset();
    } catch (error) {
      console.error('Error adding wallet:', error);
    }
  };

  const deleteBankAccount = async (id) => {
    try {
      await base44.entities.BankAccount.delete(id);
      loadData();
    } catch (error) {
      console.error('Error deleting bank account:', error);
    }
  };

  const deleteWallet = async (id) => {
    try {
      await base44.entities.ExchangeWallet.delete(id);
      loadData();
    } catch (error) {
      console.error('Error deleting wallet:', error);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Wallets & Bank Accounts</h1>
          <p className="text-slate-600">Manage your payment methods</p>
        </div>

        <Tabs defaultValue="banks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-slate-100">
            <TabsTrigger value="banks" className="data-[state=active]:bg-white">
              Bank Accounts
            </TabsTrigger>
            <TabsTrigger value="wallets" className="data-[state=active]:bg-white">
              Crypto Wallets
            </TabsTrigger>
          </TabsList>

          {/* Bank Accounts */}
          <TabsContent value="banks" className="space-y-6">
            <Card className="bg-white border-slate-200 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Bank Accounts
                </CardTitle>
                <Button
                  onClick={() => setShowBankForm(!showBankForm)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Account
                </Button>
              </CardHeader>
              <CardContent>
                {showBankForm && (
                  <form onSubmit={handleAddBankAccount} className="space-y-4 mb-6 p-4 bg-slate-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-700">Account Holder Name</Label>
                        <Input
                          name="account_holder_name"
                          required
                          className="bg-white border-slate-300 text-slate-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700">Bank Name</Label>
                        <Input
                          name="bank_name"
                          required
                          className="bg-white border-slate-300 text-slate-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700">Account Number</Label>
                        <Input
                          name="account_number"
                          required
                          className="bg-white border-slate-300 text-slate-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700">IFSC Code</Label>
                        <Input
                          name="ifsc_code"
                          required
                          className="bg-white border-slate-300 text-slate-900"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button type="submit" className="bg-green-600 hover:bg-green-700">
                        Add Account
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowBankForm(false)}
                        className="border-slate-300 text-slate-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}

                <div className="space-y-4">
                  {bankAccounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{account.bank_name}</p>
                          <p className="text-sm text-slate-600">
                            {account.account_holder_name} • ***{account.account_number?.slice(-4)}
                          </p>
                          <p className="text-xs text-slate-500">{account.ifsc_code}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {account.is_verified ? (
                          <Badge className="bg-green-100 text-green-700 border-green-300">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteBankAccount(account.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {bankAccounts.length === 0 && !showBankForm && (
                    <p className="text-center text-slate-600 py-8">No bank accounts added yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Exchange Wallets */}
          <TabsContent value="wallets" className="space-y-6">
            <Card className="bg-white border-slate-200 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-slate-900 flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-purple-600" />
                  Exchange Wallets
                </CardTitle>
                <Button
                  onClick={() => setShowWalletForm(!showWalletForm)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Wallet
                </Button>
              </CardHeader>
              <CardContent>
                {showWalletForm && (
                  <form onSubmit={handleAddWallet} className="space-y-4 mb-6 p-4 bg-slate-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-700">Exchange</Label>
                        <Select name="exchange" required>
                          <SelectTrigger className="bg-white border-slate-300 text-slate-900">
                            <SelectValue placeholder="Select exchange" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-slate-200">
                            <SelectItem value="binance">Binance</SelectItem>
                            <SelectItem value="bybit">Bybit</SelectItem>
                            <SelectItem value="coinbase">Coinbase</SelectItem>
                            <SelectItem value="kraken">Kraken</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700">Network</Label>
                        <Select name="network" required>
                          <SelectTrigger className="bg-white border-slate-300 text-slate-900">
                            <SelectValue placeholder="Select network" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-slate-200">
                            <SelectItem value="TRC20">TRC20 (Tron)</SelectItem>
                            <SelectItem value="ERC20">ERC20 (Ethereum)</SelectItem>
                            <SelectItem value="BEP20">BEP20 (BSC)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700">Wallet Address</Label>
                      <Input
                        name="wallet_address"
                        placeholder="Enter USDT wallet address"
                        required
                        className="bg-white border-slate-300 text-slate-900"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button type="submit" className="bg-green-600 hover:bg-green-700">
                        Add Wallet
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowWalletForm(false)}
                        className="border-slate-300 text-slate-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}

                <div className="space-y-4">
                  {exchangeWallets.map((wallet) => (
                    <div
                      key={wallet.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Wallet className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 capitalize">{wallet.exchange}</p>
                          <p className="text-sm text-slate-600 font-mono">
                            {wallet.wallet_address?.slice(0, 8)}...{wallet.wallet_address?.slice(-8)}
                          </p>
                          <p className="text-xs text-slate-500">{wallet.network}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {wallet.is_verified ? (
                          <Badge className="bg-green-100 text-green-700 border-green-300">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteWallet(wallet.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {exchangeWallets.length === 0 && !showWalletForm && (
                    <p className="text-center text-slate-600 py-8">No exchange wallets added yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
