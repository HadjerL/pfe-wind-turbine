import { PrismaClient } from '@/generated/prisma';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const modelType = searchParams.get('modelType')?.toUpperCase();
    const architecture = searchParams.get('architecture');
    // console.log(params);
    if (!modelType || !architecture) {
      return NextResponse.json(
        { error: 'modelType and architecture are required' },
        { status: 400 }
      );
    }

    // Find the most recent version of this model type and architecture
    const model = await prisma.classificationModel.findFirst({
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
    console.error('Error fetching classification hyperparameters:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}