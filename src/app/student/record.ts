declare global {
    interface Window {
        webkitAudioContext?: typeof AudioContext;
    }
}

import {
    AUTHCODE_LENGTH,
    FREQUENCY_SET,
    SAMPLING_TIME_TO_MS,
} from '@/constants';
import { sleep } from '@/util';

export async function startAttendanceCheck({
    name,
    studentId,
}: {
    name: string;
    studentId: string;
}): Promise<boolean> {
    const ac = new (window.AudioContext || window.webkitAudioContext)();
    await ac.resume();

    const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
    });

    const analyser = ac.createAnalyser();
    analyser.smoothingTimeConstant = 0;
    analyser.fftSize = 1024;
    ac.createMediaStreamSource(mediaStream).connect(analyser);

    const mediaRecorder = new MediaRecorder(mediaStream);
    const audioArray: Blob[] = [];
    mediaRecorder.ondataavailable = (e) => audioArray.push(e.data);

    while (true) {
        const code = await recordSignal(
            mediaRecorder,
            analyser,
            audioArray,
            ac.sampleRate
        );

        const res = await fetch('/api/code', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, studentId, name }),
        });

        const { success } = await res.json();
        if (success) return true;
    }
}

async function recordSignal(
    mediaRecorder: MediaRecorder,
    analyser: AnalyserNode,
    audioArray: Blob[],
    sampleRate: number
) {
    let recivedAuthCode: string = '';

    for (let i = 0; i < AUTHCODE_LENGTH / 2 + 1; i++) {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        audioArray.length = 0;

        mediaRecorder.start();
        await sleep(SAMPLING_TIME_TO_MS);
        mediaRecorder.stop();

        audioArray.splice(0);

        analyser.getByteFrequencyData(dataArray);

        const frequencyValues: [number, number] = [0, 0];
        for (let j = 0; j < FREQUENCY_SET.length; j++) {
            const index = Math.floor(
                (analyser.fftSize * FREQUENCY_SET[j]) / sampleRate
            );

            if (dataArray[index] > frequencyValues[1]) {
                frequencyValues[0] = j;
                frequencyValues[1] = dataArray[index];
            }
        }

        if (
            frequencyValues[0] == FREQUENCY_SET.length - 1 ||
            frequencyValues[1] == 0
        ) {
            recivedAuthCode = '';
            i = -1;
        } else {
            recivedAuthCode += String.fromCharCode(frequencyValues[0] + 0x61);
        }
    }

    return recivedAuthCode;
}
