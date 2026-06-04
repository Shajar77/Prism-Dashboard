// app/api/projects/[id]/forms/[formId]/route.ts
// Server-side proxy: GET project form details (e.g., Form 1 = site specs)

const EXTERNAL_API = "https://api.prism.mrhammadasif.com"

function getServerAuthHeaders(): HeadersInit {
  const token = process.env.JWT_TOKEN ?? ""
  const hasToken = token && token !== "your_jwt_token_here"
  return {
    "Content-Type": "application/json",
    ...(hasToken ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; formId: string }> }
) {
  try {
    const { id, formId } = await params
    const { searchParams } = new URL(_request.url)
    const year = searchParams.get("year")
    const month = searchParams.get("month")

    let targetUrl = `${EXTERNAL_API}/projects/${id}/forms/${formId}`
    const queryParams: string[] = []
    if (year) queryParams.push(`year=${year}`)
    if (month) queryParams.push(`month=${month}`)
    if (queryParams.length > 0) {
      targetUrl += `?${queryParams.join("&")}`
    }

    const res = await fetch(targetUrl, {
      headers: getServerAuthHeaders(),
      next: { revalidate: 60 },
    })
    const data = await res.json()
    return Response.json(data, { status: res.status })
  } catch {
    return Response.json({ error: "Failed to fetch project form" }, { status: 502 })
  }
}
