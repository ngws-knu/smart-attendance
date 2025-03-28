'use client';

import { startAttendance } from './signal';

export default function ProfessorPage() {
    return (
        <>
            <button onClick={() => startAttendance()}>start</button>
        </>
    );
}
