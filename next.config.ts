import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Não falhar o build de produção por causa de regras de lint.
  // Rode `pnpm run lint` localmente para limpar os avisos quando quiser.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
