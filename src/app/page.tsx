'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-sky-100 via-indigo-100 to-emerald-50">
            <h1 className="mb-10 text-3xl font-extrabold tracking-tight text-gray-800 drop-shadow-sm">
                Please select a menu
            </h1>
            <div className="flex gap-10">
                <button
                    onClick={() => router.push('/student')}
                    className="px-12 py-4 text-lg rounded-full font-semibold border-2 border-blue-400 bg-white/80 text-blue-700 shadow-md backdrop-blur-sm transition-all duration-150 hover:bg-blue-100 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    Student Menu
                </button>
                <button
                    onClick={() => router.push('/professor')}
                    className="px-12 py-4 text-lg rounded-full font-semibold border-2 border-yellow-400 bg-white/80 text-yellow-700 shadow-md backdrop-blur-sm transition-all duration-150 hover:bg-yellow-100 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                >
                    Professor Menu
                </button>
            </div>
        </div>
    );
}
