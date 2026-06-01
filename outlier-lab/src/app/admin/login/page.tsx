"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getWallets } from "@wallet-standard/app";

const ADMIN_WALLET = "0x8bc4555d0f1c8365fd377e9823f993b59b90b62e5eb375db084112f2e29711fa";

export default function AdminLogin() {
  const [status, setStatus] = useState<"idle" | "connecting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  async function verifyAndLogin(address: string) {
    if (address.toLowerCase() !== ADMIN_WALLET.toLowerCase()) {
      setErrorMsg("Unauthorized wallet. Access denied.");
      setStatus("error");
      return;
    }
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

  const normalizeAddress = (value: string) => value.trim().toLowerCase();

  try {
    const walletApi = getWallets();
    const registeredWallets = walletApi.get();

    const slushWallet = registeredWallets.find((wallet) => {
      const typedWallet = wallet as any;
      const name = typedWallet.name?.toLowerCase() ?? "";
      const id = typedWallet.id?.toLowerCase() ?? "";
      return name.includes("slush") || name.includes("sui") || id.includes("slush") || id.includes("sui");
    });

    if (slushWallet) {
      const connect = (slushWallet as any).features?.["standard:connect"]?.connect;
      const result = await connect?.();
      const address = result?.accounts?.[0]?.address ?? (slushWallet as any).accounts?.[0]?.address;

      if (address) {
        await verifyAndLogin(address);
        return;
      }
    }

    const win = window as any;
    const directWallet = win.slush ?? win.suiWallet ?? win.sui ?? win.__slush__ ?? win.Slush;

    if (directWallet) {
      await directWallet.requestPermissions?.({ permissions: ["viewAccount"] });
      await directWallet.requestPermissions?.();

      const accounts = await directWallet.getAccounts?.();
      const address = Array.isArray(accounts) ? accounts[0] : accounts?.[0]?.address;

      if (address) {
        await verifyAndLogin(normalizeAddress(address));
        return;
      }
    }

    const availableWallets = registeredWallets
      .map((wallet) => {
        const typedWallet = wallet as any;
        return typedWallet.name || typedWallet.id;
      })
      .filter(Boolean);
    setErrorMsg(
      availableWallets.length
        ? `Slush is detected, but it has no accessible account yet. Available wallets: ${availableWallets.join(", ")}. Unlock the extension and try again.`
        : "Wallet not detected. Install or unlock the Slush extension in Chrome, then refresh this page."
    );
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