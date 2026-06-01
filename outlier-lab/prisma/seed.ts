import { Client } from "pg";
import "dotenv/config";

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const categories = [
  { name: "Blockchain Technology", slug: "blockchain", icon: "⛓️", color: "#6366f1" },
  { name: "DeFi", slug: "defi", icon: "🏦", color: "#8b5cf6" },
  { name: "NFT Marketplace", slug: "nft", icon: "🎨", color: "#ec4899" },
  { name: "Web3", slug: "web3", icon: "🌐", color: "#3b82f6" },
  { name: "Smart Contracts", slug: "smart-contracts", icon: "📜", color: "#10b981" },
  { name: "DEX", slug: "dex", icon: "🔄", color: "#f59e0b" },
  { name: "AMM", slug: "amm", icon: "💧", color: "#06b6d4" },
  { name: "Flash Loans", slug: "flash-loans", icon: "⚡", color: "#f97316" },
  { name: "Yield Farming", slug: "yield-farming", icon: "🌾", color: "#84cc16" },
  { name: "Stablecoins", slug: "stablecoins", icon: "💵", color: "#14b8a6" },
  { name: "Python", slug: "python", icon: "🐍", color: "#eab308" },
  { name: "Machine Learning", slug: "machine-learning", icon: "🤖", color: "#a855f7" },
  { name: "Web Development", slug: "web-development", icon: "💻", color: "#0ea5e9" },
  { name: "NISM / NCFM", slug: "nism-ncfm", icon: "📊", color: "#f43f5e" },
  { name: "dApp Development", slug: "dapp", icon: "🔗", color: "#22c55e" },
];

async function main() {
  await client.connect();
  console.log("Seeding categories...");

  for (const cat of categories) {
    await client.query(
      `INSERT INTO categories (id, name, slug, icon, color, description, "isActive", "sortOrder", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, true, 0, NOW(), NOW())
       ON CONFLICT (slug) DO NOTHING`,
      [cat.name, cat.slug, cat.icon, cat.color, `Learn everything about ${cat.name}`]
    );
  }

  console.log("✅ Seeding complete! 15 categories added.");
  await client.end();
}

main().catch(async (e) => {
  console.error(e);
  await client.end();
  process.exit(1);
});