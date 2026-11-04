import type {NextConfig} from 'next';
const config:NextConfig = {
  // Use TypeScript's compiler API: CLI output capture is unreliable in this sandbox.
  experimental:{useTypeScriptCli:false},
};
export default config;
