import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Welcome to the Home Page</h1>
      <Link
        href="/ui"
        className="px-6 py-3 bg-blue-900 text-white rounded-3xl hover:bg-blue-700 transition"
      >
        Go to Color Palette
      </Link>
    </div>
  );
}
