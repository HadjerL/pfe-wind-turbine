import { NextResponse } from 'next/server';

export async function POST() {
  try {

    const response = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );

    response.cookies.set({
      name: 'token',
      value: '',
      expires: new Date(0), 
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Logout failed" },
      { status: 500 }
    );
  }
}