import { auth } from "@/lib/auth";
import { createHmac } from "node:crypto";
import { headers } from "next/headers";

async function forward(request, { params }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return Response.json({ message: "Please log in" }, { status: 401 });
  const secret = process.env.API_SHARED_SECRET;
  const base = process.env.ROUTESYNC_SERVER_URL;
  if (!secret || !base) return Response.json({ message: "Operations server is not configured" }, { status: 503 });
  const { path } = await params;
  const target = new URL(`${base.replace(/\/$/, "")}/api/v1/operations/${path.map(encodeURIComponent).join("/")}`);
  target.search = new URL(request.url).search;
  const body = ["POST", "PATCH", "PUT"].includes(request.method) ? await request.json().catch(() => ({})) : {};
  const identity = Buffer.from(JSON.stringify({ id: session.user.id, name: session.user.name, email: session.user.email, role: session.user.role || "employee" })).toString("base64url");
  const timestamp = String(Date.now());
  const signature = createHmac("sha256", secret).update(`${timestamp}.${request.method}.${target.pathname}${target.search}.${identity}.${JSON.stringify(body)}`).digest("hex");
  try {
    const response = await fetch(target, { method: request.method, headers: { "Content-Type": "application/json", "x-route-timestamp": timestamp, "x-route-identity": identity, "x-route-signature": signature }, body: request.method === "GET" ? undefined : JSON.stringify(body), cache: "no-store" });
    return new Response(await response.text(), { status: response.status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ message: "Operations server is unavailable" }, { status: 503 });
  }
}
export const GET = forward;
export const POST = forward;
export const PATCH = forward;
