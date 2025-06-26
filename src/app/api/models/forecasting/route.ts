import { PrismaClient } from '@/generated/prisma';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, modelType, architecture, hyperparameters, evaluation, forecastHorizon } = await req.json();

    if (!name || !modelType || !architecture || !hyperparameters || !evaluation || !forecastHorizon) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const savedModel = await prisma.forecastModel.create({
      data: {
        name,
        modelType,
        architecture,
        hyperparameters,
        evaluation,
        forecastHorizon
      }
    });

    return NextResponse.json({
      message: 'Forecast model saved successfully',
      model: savedModel
    });

  } catch (error) {
    console.error('Error saving forecast model:', error);
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
    const models = await prisma.forecastModel.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(models);

  } catch (error) {
    console.error('Error fetching forecast models:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}