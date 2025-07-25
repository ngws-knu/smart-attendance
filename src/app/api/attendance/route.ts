import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

type AttendanceRecord = {
    studentId: string;
    timestamp: number;
};

const attendanceFile = path.join(process.cwd(), 'src/attendance.json');

async function readAttendance(): Promise<AttendanceRecord[]> {
    try {
        const data = await fs.readFile(attendanceFile, 'utf-8');
        return JSON.parse(data) as AttendanceRecord[];
    } catch {
        return [];
    }
}

export async function GET() {
    try {
        const attendance = await readAttendance();
        return NextResponse.json({ attendance });
    } catch {
        return NextResponse.json({ error: 'Server error.' }, { status: 500 });
    }
}
