export function normalizeAddress(addr: string): string {
  if (!addr) throw new Error("address required");
  const a = addr.toLowerCase();
  if (!/^0x[0-9a-f]{40}$/.test(a)) throw new Error(`invalid address: ${addr}`);
  return a;
}
