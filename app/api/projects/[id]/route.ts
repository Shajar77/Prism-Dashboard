// app/api/projects/[id]/route.ts
// Server-side proxy: PUT (update) and DELETE for a single project

const EXTERNAL_API = "https://api.prism.mrhammadasif.com"

function getServerAuthHeaders(): HeadersInit {
  const token = process.env.JWT_TOKEN ?? ""
  const hasToken = token && token !== "your_jwt_token_here"
  return {
    "Content-Type": "application/json",
    ...(hasToken ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const res = await fetch(`${EXTERNAL_API}/projects/${id}`, {
      method: "PUT",
      headers: getServerAuthHeaders(),
      body: JSON.stringify(body),
    })
    const data = await res.json()
    return Response.json(data, { status: res.status })
  } catch {
    return Response.json({ error: "Failed to update project" }, { status: 502 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const res = await fetch(`${EXTERNAL_API}/projects/${id}`, {
      method: "DELETE",
      headers: getServerAuthHeaders(),
    })
    if (!res.ok) {
      return Response.json({ error: "Failed to delete project" }, { status: res.status })
    }
    return new Response(null, { status: 204 })
  } catch {
    return Response.json({ error: "Failed to delete project" }, { status: 502 })
  }
}
