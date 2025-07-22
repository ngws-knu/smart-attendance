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

export async function startAttendanceCheck() {
    const ac = new (window.AudioContext || window.webkitAudioContext)();
    ac.resume();

    const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
    });
    const mediaRecorder = new MediaRecorder(mediaStream);
    const audioSource = ac.createMediaStreamSource(mediaStream);

    const audioArray: Blob[] = [];

    mediaRecorder.ondataavailable = (e) => {
        audioArray.push(e.data);
    };

    const analyser = ac.createAnalyser();
    analyser.smoothingTimeConstant = 0;
    analyser.fftSize = 1024;

    audioSource.connect(analyser);

    while (true) {
        const code = await recordSignal(
            mediaRecorder,
            analyser,
            audioArray,
            ac.sampleRate
        );

        console.log(code);
        break;
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
        await sleep(SAMPLING_TIME_TO_MS + 2);
        mediaRecorder.stop();

        audioArray.splice(0);

        analyser.getByteFrequencyData(dataArray);
        console.log(i);

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
