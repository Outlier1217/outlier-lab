"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthorizedAdminWallet, requestAdminWalletConnection } from "@/lib/admin-wallet";

export default function AdminLogin() {
  const [status, setStatus] = useState<"idle" | "connecting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [connectedAddress, setConnectedAddress] = useState("");
  const router = useRouter();

  async function verifyAndLogin(address: string) {
    if (!isAuthorizedAdminWallet(address)) {
      setErrorMsg("Unauthorized wallet. Access denied.");
      setStatus("error");
      return;
    }

    setConnectedAddress(address);
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress: address }),
    });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setErrorMsg("Server error. Try again.");
      setStatus("error");
    }
  }

async function connectSlush() {
  setStatus("connecting");
  setErrorMsg("");

  try {
    const address = await requestAdminWalletConnection();

    if (address) {
      await verifyAndLogin(address);
      return;
    }

    setErrorMsg("Wallet approval was cancelled or no account was returned. Try connecting the Slush wallet again.");
    setStatus("error");
  } catch (e: any) {
    setErrorMsg("Error: " + (e?.message ?? String(e)));
    setStatus("error");
  }
}

  return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center p-4"
      style={{ backgroundImage: `radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.15) 0%, transparent 60%)` }}>

      <div className="relative w-full max-w-md">
        <div className="absolute -inset-1 rounded-2xl opacity-20 blur-xl"
          style={{ background: "linear-gradient(135deg, #8b5cf6, #3b82f6)" }} />

        <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M14 2L24 8V20L14 26L4 20V8L14 2Z" stroke="white" strokeWidth="1.5" fill="none"/>
                <circle cx="14" cy="14" r="3" fill="white"/>
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-white">Outlier Lab</h1>
            <p className="text-sm text-white/40 mt-1">Admin Dashboard</p>
          </div>

          <div className="border-t border-white/[0.06] mb-6" />

          {/* Info box */}
          <div className="mb-6 rounded-xl bg-violet-500/10 border border-violet-500/20 p-4">
            <p className="text-sm text-violet-300 leading-relaxed">
              Connect your <span className="font-semibold text-white">Slush wallet</span> to verify admin identity. Only the authorized wallet can access this panel.
            </p>
          </div>

          {connectedAddress && (
            <div className="mb-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300/70 mb-1">Connected wallet</p>
              <p className="text-sm text-emerald-200 font-mono break-all">{connectedAddress}</p>
            </div>
          )}

          {/* Error */}
          {status === "error" && (
            <div className="mb-5 rounded-xl bg-red-500/10 border border-red-500/20 p-4">
              <p className="text-sm text-red-300">{errorMsg}</p>
            </div>
          )}

          {/* Connect button */}
          <button onClick={connectSlush} disabled={status === "connecting"}
            className="w-full py-3.5 rounded-xl font-medium text-sm text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)", boxShadow: "0 4px 24px rgba(124,58,237,0.3)" }}>
            {status === "connecting" ? (
              <><span className="animate-spin">⟳</span> Connecting...</>
            ) : (
              <>🔗 Connect Slush Wallet</>
            )}
          </button>

          <p className="text-center text-xs text-white/20 mt-6">
            Open in local Chrome with Slush extension installed
          </p>
        </div>
      </div>
    </div>
  );
}