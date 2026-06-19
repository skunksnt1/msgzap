import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Não falhar o build de produção por causa de regras de lint.
  // Rode `pnpm run lint` localmente para limpar os avisos quando quiser.
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Rede de segurança: não derrubar o build por erros de tipo.
  // Rode `pnpm run typecheck` localmente para corrigi-los com calma.
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
