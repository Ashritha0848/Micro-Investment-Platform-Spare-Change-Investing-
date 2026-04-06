## Micro-Investment Platform – Spare Change Investing (Chennai)

This is a micro-investment web app prototype that helps young professionals in Chennai convert their daily **spare change** into simulated investments, using only mock data and a simple rules-based engine.

The app focuses on:
- **Automatic spare change capture** from daily expenses
- **Wallet of accumulated spare change** with auto-invest when a threshold is reached
- **Simple portfolio tracking and projections**
- **Goal-based saving** and basic behavioural nudges

Built with **React + TypeScript + Vite + Express (full stack)** and no paid tools.

---

## Problem Understanding (summary)

Many young earners like Amit in Chennai spend daily on food, coffee, rides, and small luxuries. Individually these spends look small, but together they could fund long-term goals. Traditional investment platforms expect:

- User-initiated transfers
- Larger ticket sizes
- Active decision-making each time

As a result, people who know they should invest still fail to do it consistently.

This prototype demonstrates a **micro-investment platform** that:

- Captures spending as transactions
- Rounds them up to the next ₹10
- Moves the spare change into a wallet
- Auto-invests the wallet into a simulated portfolio once it reaches a threshold

No real money or integrations are used; all data is mock and in-memory.

---

## Architecture Overview

High-level architecture:

- **Frontend (React SPA)**
  - `FakeAuth`: mock OTP login, Aadhaar/PAN inputs, risk profile selection
  - `Dashboard`: high-level cards (total saved, invested, projections)
  - `TransactionForm`: add daily transactions and compute spare change
  - `WalletView`: shows spare change wallet and recent notifications
  - `InvestmentsView`: list of auto-created investments with expected returns
  - `HistoryView`: transaction and investment history
  - `GoalsView`: simple goal-based investment view and progress

- **Backend API (Express, in-memory mock DB)**
  - `POST /api/auth/login` for mock login session
  - `POST /api/transactions/auto` generates transaction + smart spare + immediate invest
  - `POST /api/goals` creates goals
  - `GET /api/state/:userId` returns dashboard, history, notifications, balances
  - Applies risk-based return and FD/MF/Gold/Stocks percentage allocation

State is now handled on the backend and fetched by the frontend.

Simple text diagram:

```text
User → TransactionForm → Wallet (spare change) → Auto-Invest Engine → Investments
                                 ↓
                           Dashboard & Analytics
                                 ↓
                          Goals & Projections
```

---

## Running the Project

### Prerequisites

- Node.js 18+ and npm installed
- MongoDB running locally (or use any MongoDB URI)

### Steps

```bash
cd Hackathon-fintech
npm install
npm run dev
```

Then open the frontend URL shown in the terminal (usually `http://localhost:5173` or `http://localhost:5174`).

### MongoDB config

- Copy `.env.example` to `.env`
- Update `MONGODB_URI` if needed

---

## How to Use the App (Demo Flow)

1. **Login (mock)**
   - Enter a phone number, submit.
   - Enter any OTP (e.g. `1234`) – verification is simulated.
   - Fill dummy Aadhaar and PAN, choose a risk profile, continue.

2. **Add a transaction**
   - Go to the **Add Daily Expense** card.
   - Enter an amount (e.g. `87`) and a category.
   - The system computes the rounded amount (₹90) and spare change (₹3) and adds spare change to the wallet.

3. **Watch the wallet and auto-invest**
   - The **Spare Change Wallet** card shows the accumulated spare change.
   - Once the wallet balance crosses **₹100**, the system:
     - Creates a new investment for the current wallet amount.
     - Resets the wallet back to ₹0.
     - Shows a notification about the auto-invest.

4. **View dashboard and analytics**
   - **Total Saved from Spare Change** – lifetime spare change captured.
   - **Invested via Auto-Invest** – total amount moved into investments.
   - **Projected Growth** – simple 6-month, 1-year and 1-year portfolio projections based on current behaviour.

5. **Check history and goals**
   - **History** shows detailed transaction and investment lists.
   - **Goals** lets you define targets like "Goa trip" or "Emergency fund" and see progress (mock allocation).

---

## Files & Structure (key parts)

- `package.json` – dependencies and scripts
- `vite.config.ts` – Vite + React SWC config
- `tsconfig.json` – TypeScript configuration
- `index.html` – app entry HTML
- `src/main.tsx` – React root render
- `src/styles.css` – global modern UI styling
- `src/types.ts` – TypeScript models (User, Transaction, Investment, Goal)
- `server/index.js` – Express backend API and business logic
- `src/api.ts` – frontend API client
- `src/modules/App.tsx` – main frontend orchestrator and server-state syncing
- `src/modules/FakeAuth.tsx` – simulated OTP login + Aadhaar/PAN + risk profile
- `src/modules/TransactionForm.tsx` – add expenses
- `src/modules/WalletView.tsx` – spare change wallet + notifications
- `src/modules/Dashboard.tsx` – top-level metrics and projections
- `src/modules/InvestmentsView.tsx` – investment list view
- `src/modules/HistoryView.tsx` – transactions and investment history
- `src/modules/GoalsView.tsx` – simple goal tracking

---

## Constraints & Assumptions

- **Mock data only** – all state is in memory and resets on refresh.
- **No real KYC** – Aadhaar and PAN are dummy, masked locally.
- **No real payments/investments** – no UPI, bank, or broker APIs.
- **Simplified returns** – single expected return rate by risk profile, uses simple interest approximation for projections.
- **Single-user demo** – multi-user and auth are out of scope for this MVP.

These are acceptable for the hackathon and match the brief’s constraint of focusing on **logic and design**, not full production readiness.

---

## Limitations & Future Scope (for judges)

- **Real integrations**
  - Connect to bank/UPI APIs to capture real transactions.
  - Integrate with SEBI-regulated mutual funds or micro-investment products.

- **Stronger analytics**
  - Category-level spending vs investing insights.
  - Behavioural nudges (streaks, badges, safety mode based on overspending).

- **Smarter investment engine**
  - Proper portfolio allocation by risk profile.
  - Goal-based allocation of each investment.
  - Backed by a real backend and database.

- **Security & compliance**
  - Proper encryption, secure backend storage.
  - Full KYC workflow and compliance with Indian regulations.

This prototype is intentionally lightweight to demonstrate **concept, flow, and architecture** within limited hackathon time.

