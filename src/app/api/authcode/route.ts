import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

let latestAttendanceCode: { code: string; createdAt: number } | null = null;

const attendanceFile = path.join(process.cwd(), 'src/attendance.json');

type AttendanceRecord = {
    studentId: string;
    name: string;
    timestamp: number;
};

async function readAttendance(): Promise<AttendanceRecord[]> {
    try {
        const data = await fs.readFile(attendanceFile, 'utf-8');
        return JSON.parse(data) as AttendanceRecord[];
    } catch {
        return [];
    }
}

async function writeAttendance(attendance: AttendanceRecord[]): Promise<void> {
    await fs.writeFile(
        attendanceFile,
        JSON.stringify(attendance, null, 2),
        'utf-8'
    );
}

export async function POST(req: NextRequest) {
    try {
        const { code } = await req.json();
        if (!code || typeof code !== 'string') {
            return NextResponse.json(
                { error: 'Code is required.' },
                { status: 400 }
            );
        }

        latestAttendanceCode = { code, createdAt: Date.now() };
        return NextResponse.json({ success: true, code });
    } catch {
        return NextResponse.json({ error: 'Server error.' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { code: submittedCode, studentId, name } = await req.json();
        if (!submittedCode || typeof submittedCode !== 'string') {
            return NextResponse.json(
                { error: 'Submitted code is required.' },
                { status: 400 }
            );
        }
        if (!studentId || typeof studentId !== 'string') {
            return NextResponse.json(
                { error: 'studentId is required.' },
                { status: 400 }
            );
        }
        if (!name || typeof name !== 'string') {
            return NextResponse.json(
                { error: 'name is required.' },
                { status: 400 }
            );
        }
        if (!latestAttendanceCode) {
            return NextResponse.json(
                { error: 'No attendance code registered.' },
                { status: 404 }
            );
        }
        const latestCode = latestAttendanceCode.code;

        if (
            submittedCode.length < Math.ceil(latestCode.length / 2) ||
            !latestCode.includes(submittedCode)
        ) {
            return NextResponse.json({ success: false }, { status: 200 });
        }

        const attendance = await readAttendance();
        if (!attendance.find((item) => item.studentId === studentId)) {
            attendance.push({ studentId, name, timestamp: Date.now() });
            await writeAttendance(attendance);
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Server error.' }, { status: 500 });
    }
}
