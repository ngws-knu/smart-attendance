'use client';

import { useRouter } from 'next/navigation';
import { startAttendanceCheck } from './record';

export default function StudentPage() {
    const router = useRouter();
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-sky-100 via-indigo-100 to-emerald-50">
            <button
                onClick={() => router.push('/')}
                className="absolute top-6 left-6 px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-medium shadow hover:bg-gray-200 transition z-10"
            >
                ← Back
            </button>
            <h1 className="mb-10 text-2xl font-bold text-gray-800 drop-shadow-sm">
                Student Attendance
            </h1>
            <button
                onClick={() => startAttendanceCheck()}
                className="px-10 py-4 text-lg rounded-full font-semibold border-2 border-blue-400 bg-white/80 text-blue-700 shadow-md backdrop-blur-sm transition-all duration-150 hover:bg-blue-100 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
                Start Attendance
            </button>
        </div>
    );
}
