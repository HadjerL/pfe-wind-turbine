import { PrismaClient } from '@/generated/prisma';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, modelType, architecture, hyperparameters, evaluation } = await req.json();

    if (!name || !modelType || !architecture || !hyperparameters || !evaluation) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const savedModel = await prisma.classificationModel?.create({
      data: {
        name,
        modelType,
        architecture,
        hyperparameters,
        evaluation
      }
    });

    return NextResponse.json({
      message: 'Classification model saved successfully',
      model: savedModel
    });

  } catch (error) {
    console.error('Error saving classification model:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  try {
    const models = await prisma.classificationModel.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(models);

  } catch (error) {
    console.error('Error fetching classification models:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}