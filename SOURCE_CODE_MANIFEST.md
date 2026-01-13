# SOURCE CODE MANIFEST - USDT Flow Project

## Complete Project Structure & File Guide

This document provides a comprehensive manifest of all source code files in the USDT Flow project built with Base44. Due to platform limitations (no premium export), the code is being extracted and committed to GitHub systematically.

## ✅ COMPLETED - Files Already Committed to GitHub

### Pages Directory (`pages/`)
The following page components have been successfully extracted and committed:

1. **Achievements.jsx** ✓
   - Lines: 179
   - Purpose: Displays user achievements and rewards
   - Key Components: AchievementBadge, achievement statistics display

2. **AdminEarnings.jsx** ✓
   - Lines: ~150
   - Purpose: Admin earnings dashboard
   - Features: Platform earnings tracking, revenue analytics

3. **Buy.jsx** ✓
   - Lines: 366
   - Purpose: USDT purchase interface
   - Key Components: BuyForm, QuickAmountSelector, FeeBreakdown
   - Features: Multiple exchange integration (Coinbase, Binance, Bybit)

4. **Dashboard.jsx** ✓
   - Lines: 352
   - Purpose: Main landing page with portfolio overview
   - Key Components: PortfolioCard, LivePriceChart, QuickActions, RateDisplay
   - Features: Real-time USDT rates, balance display, transaction history

5. **History.jsx** ✓
   - Lines: 188
   - Purpose: Transaction history view
   - Key Components: Transaction table, filters, search, status tracking
   - Features: Filter by type, sort, pagination

6. **Sell.jsx** ✓
   - Lines: 413
   - Purpose: USDT selling interface
   - Key Components: SellForm, security prompts, wallet balance
   - Security: KYC checks, PIN verification, biometric authentication

7. **Trade.jsx** ✓
   - Lines: 283
   - Purpose: Advanced trading interface
   - Key Components: TradeForm, price alerts, live rates
   - Features: USDT to INR conversion, fee calculations

8. **Wallets.jsx** ✓
   - Lines: 354
   - Purpose: Wallet and account management
   - Key Features: Multiple wallet management, bank account linking, exchange wallet connections

---

## ⏳ PENDING - Files to be Extracted from Base44

### Remaining Pages (3 files)

#### KYC.jsx
- **Location**: Pages/KYC in Base44 editor
- **Purpose**: KYC (Know Your Customer) verification process
- **Estimated Lines**: 250-300
- **Key Components**: KYCVerification entity, identity verification UI
- **Features**: Document upload, verification status tracking

#### Kyc.jsx
- **Location**: Pages/Kyc in Base44 editor
- **Purpose**: Alternative KYC implementation (possibly for different user flows)
- **Estimated Lines**: 200-250
- **Note**: May be variant of KYC.jsx

#### News.jsx
- **Location**: Pages/News in Base44 editor
- **Purpose**: Cryptocurrency news feed
- **Estimated Lines**: 200-250
- **Features**: News feed display, filtering, search

#### Settings.jsx
- **Location**: Pages/Settings in Base44 editor
- **Purpose**: User preferences and security settings
- **Estimated Lines**: 300-350
- **Key Features**:
  - User profile management
  - Security settings (2FA, biometric, PIN)
  - Notification preferences
  - Account preferences

### Layout File

#### layout/main.jsx
- **Location**: Layout/main in Base44 editor
- **Estimated Lines**: 304
- **Purpose**: Main application layout wrapper
- **Contains**: Navigation, sidebar, main content area structure
- **Key Components**: Sidebar navigation, header, footer

---

## 50+ UI/Component Files

### Base UI Components (Built on Radix UI / Shadcn/ui)
Location: Components/ui/

- **Layout Components**
  - sidebar.jsx
  - card.jsx
  - header.jsx
  - footer.jsx
  - container.jsx

- **Form Components**
  - input.jsx
  - button.jsx
  - label.jsx
  - textarea.jsx
  - form.jsx
  - select.jsx
  - checkbox.jsx
  - radio-group.jsx
  - toggle.jsx
  - switch.jsx
  - input-otp.jsx

- **Dialog/Modal Components**
  - dialog.jsx
  - alert-dialog.jsx
  - drawer.jsx
  - popover.jsx
  - dropdown-menu.jsx
  - context-menu.jsx
  - sheet.jsx
  - tooltip.jsx
  - hover-card.jsx

- **Data Display Components**
  - table.jsx
  - tabs.jsx
  - accordion.jsx
  - pagination.jsx
  - breadcrumb.jsx
  - badge.jsx
  - progress.jsx
  - slider.jsx
  - carousel.jsx
  - scroll-area.jsx
  - skeleton.jsx
  - chart.jsx

- **Notification Components**
  - toast.jsx
  - toaster.jsx
  - sonner.jsx (Toast library)
  - use-toast.jsx

- **Other UI Components**
  - alert.jsx
  - avatar.jsx
  - aspect-ratio.jsx
  - collapsible.jsx
  - command.jsx
  - menubar.jsx
  - navigation-menu.jsx
  - resizable.jsx
  - separator.jsx
  - toggle-group.jsx
  - calendar.jsx

### Custom Business Components
Location: Components/

#### Dashboard Components
- **PortfolioCard.jsx** - Portfolio balance and statistics display
- **LivePriceChart.jsx** - Real-time price charting
- **RateDisplay.jsx** - Exchange rate information
- **QuickActions.jsx** - Fast action buttons
- **StreakCounter.jsx** - User engagement streak tracking
- **EarningsWidget.jsx** - Earnings overview display
- **AchievementBadge.jsx** - Achievement display

#### Trading Components
- **BuyForm.jsx** - Buy transaction interface
- **SellForm.jsx** - Sell transaction interface
- **TradeForm.jsx** - Advanced trading interface
- **QuickAmountSelector.jsx** - Amount selection utility
- **FeeBreakdown.jsx** - Transaction fee display

#### Security Components
- **BiometricPrompt.jsx** - Biometric authentication UI
- **PinVerification.jsx** - PIN entry interface
- **SecuritySettings.jsx** - Security configuration

#### Notification Components
- **AchievementToast.jsx** - Achievement notification
- **PriceAlertModal.jsx** - Price alert popup
- **NotificationCenter.jsx** - Centralized notifications

#### Wallet Components
- **DepositInstructions.jsx** - Deposit guidance
- **WalletCard.jsx** - Wallet display card
- **ExchangeWalletLinker.jsx** - Exchange connection UI
- **BankAccountLinker.jsx** - Bank account setup

#### Support Components
- **LiveChatWidget.jsx** - Live support chat
- **HelpCenter.jsx** - Help documentation
- **FAQSection.jsx** - FAQ display

---

## 10+ Data Entity Files

Location: Entities/ (Base44 Data Models)

### Entities Defined

1. **Transaction**
   - Properties: id, amount, type (buy/sell), status, timestamp, exchangeName, fee

2. **BankAccount**
   - Properties: id, accountNumber, bankName, ifscCode, verified, accountHolder

3. **ExchangeWallet**
   - Properties: id, exchangeName, walletAddress, balance, connected

4. **SecuritySettings**
   - Properties: id, twoFactorEnabled, biometricEnabled, pinSet, allowedDevices

5. **PriceAlert**
   - Properties: id, targetPrice, type (above/below), active, notificationMethod

6. **Achievement**
   - Properties: id, name, description, icon, unlockedDate, criteria

7. **PlatformEarnings**
   - Properties: id, date, totalTransactionFees, referralBonuses, totalEarnings

8. **Wallet**
   - Properties: id, currency, balance, reserved, available, lastUpdated

9. **Deposit**
   - Properties: id, amount, method, status, depositDate, confirmationDate

10. **KYCVerification**
    - Properties: id, userId, status (pending/verified/rejected), documents, submissionDate

---

## 🛠️ How to Extract Remaining Code from Base44

### Prerequisites
- Access to Base44 editor: https://app.base44.com/apps/69661e926ef1366381853cf5/editor/workspace/code
- Base44 account with access to USDT Flow (Copy) project

### Step-by-Step Extraction Process

1. **Navigate to File in Base44**
   - Open the Base44 editor
   - Find the file in the left sidebar (Pages, Components, or Entities)
   - Click to open

2. **Select All Code**
   - Click in the code editor
   - Press `Ctrl+A` to select all code

3. **Copy Code**
   - Press `Ctrl+C` to copy

4. **Create File in GitHub**
   - Navigate to the appropriate folder in GitHub
   - Click "Add file" → "Create new file"
   - Name the file with .jsx or .md extension
   - Paste the code
   - Write a commit message describing the file
   - Click "Commit changes"

### File Organization in GitHub

```
USDT-Flow/
├── pages/                    (Already has 8 files)
│   ├── Achievements.jsx      ✓
│   ├── AdminEarnings.jsx     ✓
│   ├── Buy.jsx               ✓
│   ├── Dashboard.jsx         ✓
│   ├── History.jsx           ✓
│   ├── Sell.jsx              ✓
│   ├── Trade.jsx             ✓
│   ├── Wallets.jsx           ✓
│   ├── KYC.jsx               (Pending)
│   ├── Kyc.jsx               (Pending)
│   ├── News.jsx              (Pending)
│   └── Settings.jsx          (Pending)
├── components/               (To be created)
│   ├── dashboard/
│   ├── trading/
│   ├── security/
│   ├── wallet/
│   └── ui/
├── layout/                   (To be created)
│   └── main.jsx              (Pending)
├── entities/                 (To be created)
│   └── (data models)
├── ARCHITECTURE.md           ✓
├── README.md                 ✓
└── SOURCE_CODE_MANIFEST.md   ✓ (This file)
```

---

## 📋 Priority Extraction Order

If extracting remaining files, follow this priority:

### Phase 1 (High Priority - Core Pages)
1. Settings.jsx
2. KYC.jsx
3. News.jsx
4. Kyc.jsx
5. layout/main.jsx

### Phase 2 (Medium Priority - Key Components)
1. Dashboard components (PortfolioCard, LivePriceChart, etc.)
2. Trading components (BuyForm, SellForm, TradeForm)
3. Security components (BiometricPrompt, PinVerification, SecuritySettings)

### Phase 3 (Additional - UI & Supporting)
1. All UI base components
2. Entity definitions
3. Support and wallet components

---

## 🔗 Project References

- **Base44 Editor**: https://app.base44.com/apps/69661e926ef1366381853cf5/editor/workspace/code
- **Live App**: https://usdt-flow-534d2a36.base44.app/
- **GitHub Repository**: https://github.com/aadityaanand11/USDT-Flow

---

## 📝 Notes

- All code is from Base44 visual editor export
- React + Tailwind CSS + Radix UI stack
- Full-stack features: KYC, 2FA, wallets, trading
- No source dependencies on external repositories (all built in Base44)
- Code is platform-specific (Base44) and may need adaptation for standard React

---

**Last Updated**: January 13, 2026
**Total Files**: 60+ (8 pages committed, 52+ pending)
**Estimated Total Lines of Code**: 10,000+
