import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface LoginPageProps {
  onLogin: (email: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    // Demo only: accepts any credentials. Swap for a real check later.
    onLogin(email);
  };

  const inputClass =
    "w-full bg-transparent border-b border-white/60 py-3 text-white text-[18px] font-['Newsreader:Regular',_sans-serif] placeholder:text-white/60 focus:outline-none focus:border-white transition-colors";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 bg-[#426b1f] z-50 overflow-hidden"
    >
      <form
        onSubmit={handleSubmit}
        className="absolute left-4 right-4 top-[95px] flex flex-col gap-8"
      >
        <h1 className="font-['Newsreader:Regular',_sans-serif] font-normal text-white text-[36px] leading-[40px] tracking-[-0.52px]">
          Welcome back
        </h1>

        <div className="flex flex-col gap-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        {error && (
          <p className="text-white/90 text-[14px] -mt-4">{error}</p>
        )}

        <button
          type="submit"
          className="w-full rounded-2xl bg-white text-[#426b1f] py-3 text-[22px] font-['Newsreader:Regular',_sans-serif] tracking-[-0.52px] hover:opacity-80 transition-opacity"
        >
          Log in
        </button>
      </form>
    </motion.div>
  );
}