'use client';

import { useRouter } from 'next/navigation';
import { startAttendanceCheck } from './record';
import { useState } from 'react';

export default function StudentPage() {
    const router = useRouter();
    const [attendanceDone, setAttendanceDone] = useState(false);
    const [name, setName] = useState('');
    const [studentId, setStudentId] = useState('');
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
            <div className="flex flex-col gap-4 mb-8 w-80">
                <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 text-black"
                />
                <input
                    type="text"
                    placeholder="Enter your student ID"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 text-black"
                />
            </div>
            {attendanceDone ? (
                <div className="px-10 py-4 text-lg rounded-full font-semibold border-2 border-green-400 bg-white/80 text-green-700 shadow-md backdrop-blur-sm">
                    Attendance verification is complete.
                </div>
            ) : (
                <button
                    onClick={async () => {
                        if (!name || !studentId) {
                            alert('Please enter your name and student ID.');
                            return;
                        }
                        const ok = await startAttendanceCheck({
                            name,
                            studentId,
                        });
                        if (ok) setAttendanceDone(true);
                    }}
                    className="px-10 py-4 text-lg rounded-full font-semibold border-2 border-blue-400 bg-white/80 text-blue-700 shadow-md backdrop-blur-sm transition-all duration-150 hover:bg-blue-100 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    Start Attendance
                </button>
            )}
        </div>
    );
}
