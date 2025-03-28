export const TOTAL_ATTENDANCE_TIME_TO_SEC: number = 300;
export const PERIOD_TIME_TO_SEC: number = 5;
export const SAMPLING_TIME_TO_MS = 100;
export const AUTHCODE_LENGTH =
    (PERIOD_TIME_TO_SEC * 1000) / SAMPLING_TIME_TO_MS;
export const FREQUENCY_SET: number[] = [18000, 18500, 19000, 19500, 20000];
