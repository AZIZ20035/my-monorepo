import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7262/api';

// Disable SSL certificate verification for development
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

async function proxyRequest(request: NextRequest, path: string[]) {
  const backendPath = path.join('/');
  const search = request.nextUrl.search;
  const url = `${BACKEND_URL}/${backendPath}${search}`;
  
  // Get request body if present
  let body: string | undefined;
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    try {
      body = await request.text();
    } catch {
      body = undefined;
    }
  }

  // Forward headers
  const headers = new Headers();
  headers.set('Content-Type', request.headers.get('Content-Type') || 'application/json');
  headers.set('Accept', 'application/json');
  
  // Forward cookies from the request
  const cookies = request.headers.get('cookie');
  if (cookies) {
    headers.set('Cookie', cookies);
  }

  try {
    const response = await fetch(url, {
      method: request.method,
      headers,
      body: body || undefined,
      credentials: 'include',
    });

    // Get response data
    const data = await response.text();
    
    // Create response with backend data
    const proxyResponse = new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
    });

    // Copy response headers
    proxyResponse.headers.set('Content-Type', response.headers.get('Content-Type') || 'application/json');
    
    // Forward Set-Cookie headers from backend
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      // Modify cookie to work with our frontend domain
      const modifiedCookie = setCookieHeader
        .replace(/; secure/gi, '') // Remove Secure flag for HTTP development
        .replace(/; samesite=strict/gi, '; SameSite=Lax'); // Change to Lax for cross-port
      proxyResponse.headers.set('Set-Cookie', modifiedCookie);
    }

    return proxyResponse;
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { success: false, message: 'Proxy error: ' + (error as Error).message },
      { status: 502 }
    );
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxyRequest(request, path);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxyRequest(request, path);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxyRequest(request, path);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxyRequest(request, path);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxyRequest(request, path);
}
