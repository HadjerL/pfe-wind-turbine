// app/api/restore_old_forecasting_model/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = await fetch('http://localhost:5000/restore_old_forecasting_model', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to restore old forecasting model: ${error instanceof Error ? error.message : error}` },
      { status: 500 }
    );
  }
}