import {
    AUTHCODE_LENGTH,
    FREQUENCY_SET,
    PERIOD_TIME_TO_SEC,
    SAMPLING_TIME_TO_MS,
    TOTAL_ATTENDANCE_TIME_TO_SEC,
} from '@/constants';
import { sleep } from '@/util';

export async function startAttendance() {
    for (
        let i = 0;
        i < TOTAL_ATTENDANCE_TIME_TO_SEC / PERIOD_TIME_TO_SEC;
        i++
    ) {
        const authCode: string = generateAuthCode();
        await playSignal(authCode);
    }
}

function generateAuthCode(): string {
    let authCode: string = '';

    for (let i = 0; i < AUTHCODE_LENGTH; i++) {
        const token: string = String.fromCharCode(
            Math.floor(Math.random() * (FREQUENCY_SET.length - 1)) + 0x61
        );

        authCode += token;
    }

    return authCode;
}

async function playSignal(authCode: string) {
    const ac = new (window.AudioContext || window.webkitAudioContext)();
    ac.resume();

    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.connect(gain).connect(ac.destination);

    console.log(authCode);

    osc.start();
    for (let i = 0; i < authCode.length; i++) {
        osc.frequency.value = FREQUENCY_SET[authCode.charCodeAt(i) - 0x61];
        gain.gain.exponentialRampToValueAtTime(1, SAMPLING_TIME_TO_MS / 1000);
        await sleep(SAMPLING_TIME_TO_MS);
    }

    osc.frequency.value = FREQUENCY_SET[FREQUENCY_SET.length - 1]; // 주기 끝을 알리는 신호
    await sleep(1000);
    osc.stop();

    ac.close();
}
