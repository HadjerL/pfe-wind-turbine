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