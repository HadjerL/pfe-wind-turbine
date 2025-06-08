import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { model_type: string, model_name: string, version: string } }) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const body = await request.json();
    
    const response = await fetch(`${backendUrl}/evaluate_model/${params.model_type}/${params.model_name}/${params.version}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

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