import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: { model_type: string; model_name: string; version: string } }
) {
  try {
    const { model_type, model_name, version } = params;
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const flaskEndpoint = `${backendUrl}/delete_model/${model_type}/${model_name}/${version}`;
    
    const response = await fetch(flaskEndpoint, {
      method: 'DELETE',
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
      { error: `Failed to delete model: ${error instanceof Error ? error.message : error}` },
      { status: 500 }
    );
  }
}