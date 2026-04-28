"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Zap } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: [
            "radial-gradient(ellipse at 0% 0%, #eef2ff 0%, #f5f3ff 40%, #fdf2f8 100%)",
            "radial-gradient(ellipse at 100% 100%, #f5f3ff 0%, #eef2ff 40%, #fdf2f8 100%)",
            "radial-gradient(ellipse at 0% 100%, #fdf2f8 0%, #eef2ff 40%, #f5f3ff 100%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
      />
      <div className="absolute inset-0 -z-10 dark:bg-background" />

      {/* Floating blobs */}
      <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-brand-100/60 dark:bg-brand-900/20 blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-violet-100/60 dark:bg-violet-900/20 blur-3xl translate-y-1/2" />

      <div className="w-full max-w-md px-4 py-8 z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl gradient-bg shadow-lg">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-black gradient-text">Dividelo</span>
        </Link>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card rounded-2xl p-8 shadow-2xl"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
