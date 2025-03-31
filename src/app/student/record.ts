import { AUTHCODE_LENGTH, FREQUENCY_SET } from '@/constants';
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
    audioSource.connect(analyser);

    while (true) {
        await recordSignal(mediaRecorder, analyser, audioArray, ac.sampleRate);
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

        mediaRecorder.start();
        await sleep(100);
        mediaRecorder.stop();

        audioArray.splice(0);

        analyser.getByteFrequencyData(dataArray);

        const frequencyValues: [number, number] = [0, 0];
        for (let j = 0; j < FREQUENCY_SET.length; j++) {
            const f = FREQUENCY_SET[j];
            const index = Math.floor((analyser.fftSize * f) / sampleRate);

            if (dataArray[index] >= frequencyValues[1]) {
                frequencyValues[0] = f;
                frequencyValues[1] = dataArray[index];
            }
        }
    }
}
