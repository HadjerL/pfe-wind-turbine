import * as tf from '@tensorflow/tfjs-node';
import { NextRequest, NextResponse } from 'next/server';

// Load the model globally to avoid reloading it on every request
let model: tf.LayersModel | null = null;
async function loadModel() {
    if (!model) {
        model = await tf.loadLayersModel('file://public/model_tfjs/model.json');
    }
}

export async function POST(req: NextRequest) {
    await loadModel(); // Ensure model is loaded

    const { data } = await req.json(); // Expecting an array of DataPoints
    if (!Array.isArray(data)) {
        return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }

    // Convert DataPoints to tensor (excluding timestamp)
    const inputTensor = tf.tensor2d(data.map(d => Object.values(d).slice(1).map(value => Number(value)))); // Exclude Timestamp

    // Predict
    const predictions = model!.predict(inputTensor) as tf.Tensor;
    const predictionArray = await predictions.array() as number[][];

    // Format results
    const result = data.map((item, idx) => ({
        Timestamp: item.Timestamp,
        Classes: (predictionArray[idx] as number[]).map((v: number, i: number) => (v > 0.5 ? i : null)).filter(v => v !== null)
    }));

    return NextResponse.json(result);
}
