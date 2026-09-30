export async function operation(path, options = {}) {
  const response = await fetch(`/api/operations/${path}`, {
    method: options.method || "GET",
    headers: { "Content-Type": "application/json" },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: "no-store",
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || "Request failed");
  return result.data;
}
