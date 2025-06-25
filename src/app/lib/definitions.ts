export type Variable = {
    key: string;
    name: string;
};

export type DataPoint = {
    Timestamp: string;
    Asset_ID: number;
    Status_Type: number;
    Rotor_Speed: number;
    Rotational_Speed: number;
    Gearbox_Oil_Inlet_Temperature: number;
    RMS_Current_Phase_1_HV_Grid: number;
    RMS_Current_Phase_2_HV_Grid: number;
    RMS_Current_Phase_3_HV_Grid: number;
    RMS_Voltage_Phase_1_HV_Grid: number;
    RMS_Voltage_Phase_2_HV_Grid: number;
    RMS_Voltage_Phase_3_HV_Grid: number;
    Min_Pitch_Angle: number;
    Rotor_Bearing_Temperature: number;
    Outside_Temperature: number;
    Wind_Speed: number;
    Power_Output: number;
    Nacelle_Air_Pressure: number;
    Wind_Direction_Sin: number;
    Wind_Direction_Cos: number;
};

export type Classification = {
    Predicted_Classes: string[];
}

export type Forecast = {
    timestamp: string;
    power_output: number;
}

export type ClassificationMetric = {
    precision: number;
    recall: number;
    'f1-score': number;
    support: number;
};

export type ClassificationReport = {
    [key: string]: ClassificationMetric | number;
};

export type PairMetric = {
    pair: string;
    precision: number;
    recall: number;
    f1_score: number;
    support: number;
};

export type ClassPairEvaluation = {
    accuracy_two_active: number | null;
    pair_metrics: PairMetric[];
};

export type NormalVsAbnormalEvaluation = {
    accuracy: number;
    classification_report: ClassificationReport;
};

export type SingleClassEvaluation = {
    accuracy: number | null;
    classification_report: ClassificationReport | null;
    message?: string;
};

export type MultiLabelEvaluation = {
    accuracy: number;
    classification_report: ClassificationReport;
};

export type ModelEvaluation = {
    class_pair_evaluation: ClassPairEvaluation;
    evaluate_normal_vs_abnormal: NormalVsAbnormalEvaluation;
    evaluate_single_class: SingleClassEvaluation;
    multi_label_evaluation: MultiLabelEvaluation;
};

export type ModelHyperparameters = {
  model_type: string;
  architecture: string;
  num_conv_layers?: number;
  conv1_filters?: number;
  num_dense_layers?: number;
  dense1_units?: number;
  batch_size: number;
  optimizer: string;
  learning_rate: number;
  lstm_units?: number;
  num_lstm_layers?: number;
  rnn_units?: number;
  num_rnn_layers?: number;
};

export type TuningResults = {
  evaluation: {
    [modelName: string]: ModelEvaluation;
  };
  hyperparameters?: {
    [modelName: string]: ModelHyperparameters;
  };
  message: string;
};


export interface ForecastOverallMetrics {
    mse: number;
    rmse: number;
    mae: number;
    r2: number;
    mape: number;
    mean_test: number;
}

export interface ForecastStepMetric {
    horizon: number;
    mse: number;
    rmse: number;
    mae: number;
    r2: number;
    mape: number;
}

export interface ForecastVisualizationData {
    input_sequence: {
        timestamps: string[];
        values: number[];
    };
    predicted_values: {
        timestamps: string[];
        values: number[];
    };
    true_values: {
        timestamps: string[];
        values: number[];
    };
}

export interface ForecastModelEvaluation {
    overall_metrics: ForecastOverallMetrics;
    step_metrics: ForecastStepMetric[];
    test_samples: number;
    train_samples: number;
    visualization_data: ForecastVisualizationData[];
}

export interface ForecastTuningResults {
    forecast_horizon: number;
    message: string;
    results: {
        [modelName: string]: ForecastModelEvaluation;
    };
}

export type HyperparameterConfig = {
  modelType: 'CNN' | 'LSTM' | 'RNN';
  maxTrials: number;
  executionsPerTrial: number;
  epochs: number;
  patience: number;
  batchSizes: number[];
  optimizers: ('adam' | 'sgd' | 'rmsprop')[]
  learningRates: number[];
  
  // CNN-specific parameters
  convFilters?: number[];
  numConvLayers?: number[];
  denseUnits?: number[];
  numDenseLayers?: number[];
  
  // LSTM-specific parameters
  lstmUnits?: number[];
  numLSTMLayers?: number[];
  
  // RNN-specific parameters
  rnnUnits?: number[];
  numRNNLayers?: number[];
  
  // Optional metadata
  modelName?: string;
  description?: string;
  randomSeed?: number;
};