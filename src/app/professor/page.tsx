'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { startAttendance } from './signal';

type AttendanceRecord = {
    studentId: string;
    name: string;
    timestamp: number;
};

export default function ProfessorPage() {
    const router = useRouter();
    const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>(
        []
    );
    const [isLoading, setIsLoading] = useState(false);

    // Fetch attendance data every second
    const fetchAttendance = async () => {
        try {
            const response = await fetch('/api/attendance');
            if (response.ok) {
                const data = await response.json();
                setAttendanceList(data.attendance || []);
            }
        } catch (error) {
            console.error('Failed to fetch attendance:', error);
        }
    };

    // Start real-time updates when component mounts
    useEffect(() => {
        fetchAttendance(); // Initial load

        const interval = setInterval(fetchAttendance, 1000); // Update every second

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    const handleStartAttendance = async () => {
        setIsLoading(true);
        try {
            await startAttendance();
        } catch (error) {
            console.error('Error starting attendance:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-sky-100 via-indigo-100 to-emerald-50 p-6">
            <button
                onClick={() => router.push('/')}
                className="absolute top-6 left-6 px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-medium shadow hover:bg-gray-200 transition z-10"
            >
                ← Back
            </button>

            <h1 className="mb-10 text-2xl font-bold text-gray-800 drop-shadow-sm">
                Professor Attendance Control
            </h1>

            <button
                onClick={handleStartAttendance}
                disabled={isLoading}
                className="px-10 py-4 text-lg rounded-full font-semibold border-2 border-yellow-400 bg-white/80 text-yellow-700 shadow-md backdrop-blur-sm transition-all duration-150 hover:bg-yellow-100 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed mb-8"
            >
                {isLoading ? 'Starting...' : 'Start Attendance'}
            </button>

            {/* Real-time attendance list */}
            <div className="w-full max-w-2xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                    Real-time Attendance Status ({attendanceList.length}{' '}
                    students)
                </h2>

                {attendanceList.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        No students have attended yet.
                    </div>
                ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {attendanceList.map((record, index) => (
                            <div
                                key={`${record.studentId}-${record.timestamp}`}
                                className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                        {index + 1}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-800">
                                            {record.name}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {record.studentId}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-sm text-gray-600">
                                    {formatTime(record.timestamp)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
