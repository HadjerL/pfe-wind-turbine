// app/api/available_forecasting_models/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://localhost:5000/available_forecasting_models');
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: `Failed to fetch forecasting models, ${error}` }, { status: 500 });
  }
}