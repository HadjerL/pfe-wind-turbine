// app/api/tune_forecasting_model/[modelType]/[architecture]/[version]/route.ts
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { modelType: string; architecture: string; version: string } }
) {
  try {
    const { modelType, architecture, version } = await params;
    const data = await request.json();

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const cleanVersion = version.startsWith('v') ? version.slice(1) : version;

    const response = await fetch(
      `${backendUrl}/tune_forecasting_model/${modelType}/${architecture}/${cleanVersion}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error: error.error || 'Failed to tune model' }, { status: response.status });
    }

    const results = await response.json();
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}