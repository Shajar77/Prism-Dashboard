// app/api/projects/route.ts
// Server-side proxy: keeps JWT token private (not exposed to client bundle)

const EXTERNAL_API = "https://api.prism.mrhammadasif.com"

function getServerAuthHeaders(): HeadersInit {
  const token = process.env.JWT_TOKEN ?? ""
  const hasToken = token && token !== "your_jwt_token_here"
  return {
    "Content-Type": "application/json",
    ...(hasToken ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function GET() {
  try {
    const res = await fetch(`${EXTERNAL_API}/projects`, {
      headers: getServerAuthHeaders(),
      next: { revalidate: 0 }, // always fresh
    })
    const data = await res.json()
    return Response.json(data, { status: res.status })
  } catch {
    return Response.json({ error: "Failed to reach upstream API" }, { status: 502 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const res = await fetch(`${EXTERNAL_API}/projects`, {
      method: "POST",
      headers: getServerAuthHeaders(),
      body: JSON.stringify(body),
    })
    const data = await res.json()
    return Response.json(data, { status: res.status })
  } catch {
    return Response.json({ error: "Failed to create project" }, { status: 502 })
  }
}
