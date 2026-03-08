import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import AuthLayout from "../../layouts/AuthLayout.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { DASHBOARD_PATH } from "../../utils/constants.js";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(values) {
    const u = await login(values.email, values.password);
    nav(DASHBOARD_PATH[u.role], { replace: true });
  }

  return (
    <AuthLayout>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div className="font-poppins text-2xl font-bold">Login</div>
        <div className="mt-1 text-sm text-slate-500">Access your dashboard based on your role.</div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Email" placeholder="you@example.com" {...register("email")} error={errors.email?.message} />
          <Input label="Password" type="password" placeholder="••••••••" {...register("password")} error={errors.password?.message} />

          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="mt-6 text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-semibold text-slate-900 hover:underline">
            Register
          </Link>
        </div>

      </motion.div>
    </AuthLayout>
  );
}