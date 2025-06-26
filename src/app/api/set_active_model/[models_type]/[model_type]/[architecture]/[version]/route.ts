// app/api/set_active_model/[model_type]/[model_name]/[version]/route.ts
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { models_type: string, model_type: string; architecture: string; version: string } }
) {
  try {
    const {models_type, model_type, architecture, version } = await params;
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const flaskEndpoint = `${backendUrl}/set_active_model/${models_type}/${model_type}/${architecture}/${version}`;
    
    const response = await fetch(flaskEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to set active model: ${error instanceof Error ? error.message : error}` },
      { status: 500 }
    );
  }
}