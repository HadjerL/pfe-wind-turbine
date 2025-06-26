import { NextResponse } from 'next/server';

export async function POST(
  request: Request, 
  { params }: { params: { model_type: string; model_name: string; architecture: string; version: string } }
) {
  try {
    const {architecture, version, model_name} = await params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const body = await request.json();
    const cleanVersion = version.startsWith('v') ? version.slice(1) : version;
    
    const response = await fetch(
      `${backendUrl}/evaluate_classification_model/${architecture}/${model_name}/${cleanVersion}`, 
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
      { error: `Failed to evaluate model: ${error instanceof Error ? error.message : error}` },
      { status: 500 }
    );
  }
}