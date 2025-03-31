'use client';

import { startAttendanceCheck } from './record';

export default function StudentPage() {
    return (
        <>
            <button onClick={() => startAttendanceCheck()}>start</button>
        </>
    );
}
