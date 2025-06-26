import { NextResponse } from 'next/server';

export async function POST(
  request: Request, 
  { params }: { params: { model_type: string; architecture: string; model_name: string; version: string } }
) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const body = await request.json();
    const version = params.version.startsWith('v') ? params.version.slice(1) : params.version;
    
    const response = await fetch(
      `${backendUrl}/evaluate_forecasting_model/${params.architecture}/${params.model_name}/${version}`, 
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to evaluate forecast: ${error instanceof Error ? error.message : error}` },
      { status: 500 }
    );
  }
}