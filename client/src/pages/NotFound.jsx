import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button.jsx";

export default function NotFound() {
  return (
    <div className="p-10">
      <div className="font-poppins text-2xl font-bold">404</div>
      <div className="mt-1 text-slate-600">Page not found.</div>
      <Link to="/app">
        <Button className="mt-4">Go to app</Button>
      </Link>
    </div>
  );
}