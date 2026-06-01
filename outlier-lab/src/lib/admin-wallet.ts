import { getWallets } from "@wallet-standard/app";

export const ADMIN_WALLET = "0x8bc4555d0f1c8365fd377e9823f993b59b90b62e5eb375db084112f2e29711fa";

export function isAuthorizedAdminWallet(address: string | null | undefined) {
  return !!address && address.trim().toLowerCase() === ADMIN_WALLET.toLowerCase();
}

function normalizeAddress(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function findAdminWallet() {
  const walletApi = getWallets();
  const registeredWallets = walletApi.get();

  return registeredWallets.find((wallet) => {
    const typedWallet = wallet as any;
    const name = typedWallet.name?.toLowerCase() ?? "";
    const id = typedWallet.id?.toLowerCase() ?? "";
    return name.includes("slush") || name.includes("sui") || id.includes("slush") || id.includes("sui");
  });
}

async function disconnectAdminWallet(wallet: unknown) {
  const disconnect = (wallet as any)?.features?.["standard:disconnect"]?.disconnect;

  if (typeof disconnect === "function") {
    try {
      await disconnect();
    } catch {
      // Ignore disconnect failures and continue with a fresh connect attempt.
    }
  }
}

export async function readConnectedAdminWalletAddress() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const slushWallet = findAdminWallet();

    if (slushWallet) {
      const connect = (slushWallet as any).features?.["standard:connect"]?.connect;
      const result = await connect?.({ silent: true });
      const address = result?.accounts?.[0]?.address ?? (slushWallet as any).accounts?.[0]?.address;

      if (address) {
        return normalizeAddress(address);
      }
    }

    const win = window as any;
    const directWallet = win.slush ?? win.suiWallet ?? win.sui ?? win.__slush__ ?? win.Slush;

    if (directWallet) {
      const accounts = await directWallet.getAccounts?.();
      const address = Array.isArray(accounts) ? accounts[0] : accounts?.[0]?.address;

      if (address) {
        return normalizeAddress(address);
      }
    }
  } catch {
    return null;
  }

  return null;
}

export async function requestAdminWalletConnection() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const slushWallet = findAdminWallet();

    if (slushWallet) {
      await disconnectAdminWallet(slushWallet);

      const connect = (slushWallet as any).features?.["standard:connect"]?.connect;
      const result = await connect?.({ silent: false });
      const address = result?.accounts?.[0]?.address ?? (slushWallet as any).accounts?.[0]?.address;

      if (address) {
        return normalizeAddress(address);
      }
    }

    const win = window as any;
    const directWallet = win.slush ?? win.suiWallet ?? win.sui ?? win.__slush__ ?? win.Slush;

    if (directWallet) {
      await disconnectAdminWallet(directWallet);

      await directWallet.requestPermissions?.({ permissions: ["viewAccount"] });
      await directWallet.requestPermissions?.();

      const accounts = await directWallet.getAccounts?.();
      const address = Array.isArray(accounts) ? accounts[0] : accounts?.[0]?.address;

      if (address) {
        return normalizeAddress(address);
      }
    }
  } catch {
    return null;
  }

  return null;
}