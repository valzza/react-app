export function splitName(full = "") {
    const parts = full.trim().split(/\s+/);
    const first = parts[0] || "";
    const last  = parts.length > 1 ? parts[parts.length - 1] : "";
    const middle = parts.slice(1, -1).join(" ");
    return { first, middle, last };
}