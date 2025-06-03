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

export type TuningResults = {
    evaluation: {
        [modelName: string]: ModelEvaluation;
    };
    message: string;
};