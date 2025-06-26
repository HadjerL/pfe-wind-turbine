import { PrismaClient } from '@/generated/prisma';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const architecture = searchParams.get('architecture');

    if (!architecture) {
      return NextResponse.json(
        { error: 'architecture is required' },
        { status: 400 }
      );
    }

    // Find the most recent version of this architecture
    const model = await prisma.forecastModel.findFirst({
      where: {
        architecture
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        hyperparameters: true
      }
    });

    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(model.hyperparameters);

  } catch (error) {
    console.error('Error fetching forecast hyperparameters:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}