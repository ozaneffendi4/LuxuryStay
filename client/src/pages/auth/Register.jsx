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
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

export default function Register() {
  const nav = useNavigate();
  const { register: doRegister } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(values) {
    const u = await doRegister(values.name, values.email, values.password);
    nav(DASHBOARD_PATH[u.role], { replace: true });
  }

  return (
    <AuthLayout>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div className="font-poppins text-2xl font-bold">Create account</div>
        <div className="mt-1 text-sm text-slate-500">Guests can browse and book rooms.</div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Full Name" placeholder="Your name" {...register("name")} error={errors.name?.message} />
          <Input label="Email" placeholder="you@example.com" {...register("email")} error={errors.email?.message} />
          <Input label="Password" type="password" placeholder="Minimum 6 characters" {...register("password")} error={errors.password?.message} />

          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create account"}
          </Button>
        </form>

        <div className="mt-6 text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-slate-900 hover:underline">
            Login
          </Link>
        </div>
      </motion.div>
    </AuthLayout>
  );
}