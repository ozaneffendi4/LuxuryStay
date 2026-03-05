import React from "react";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 items-center gap-8 p-6 md:grid-cols-2">
        <div className="hidden md:block">
          <div className="rounded-3xl bg-slate-900 p-10 text-white">
            <div className="font-poppins text-3xl font-bold">LuxuryStay</div>
            <div className="mt-2 text-sm opacity-90">Airbnb-style booking + Stripe-style dashboards.</div>
            <div className="mt-6 text-xs opacity-80">
              Secure • Role-based • Analytics • Logs • Settings • Payments (Simulated)
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">{children}</div>
      </div>
    </div>
  );
}