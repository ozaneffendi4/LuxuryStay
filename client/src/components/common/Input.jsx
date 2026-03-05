import React from "react";

const Input = React.forwardRef(function Input({ label, error, ...props }, ref) {
  return (
    <label className="block">
      {label ? <div className="mb-1 text-sm font-semibold text-slate-700">{label}</div> : null}

      <input
        ref={ref}
        {...props}
        className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition ${
          error
            ? "border-rose-400 focus:ring-2 focus:ring-rose-200"
            : "border-slate-200 focus:ring-2 focus:ring-slate-200"
        }`}
      />

      {error ? <div className="mt-1 text-xs text-rose-600">{error}</div> : null}
    </label>
  );
});

export default Input;