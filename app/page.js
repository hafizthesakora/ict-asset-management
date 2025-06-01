import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex flex-col items-center justify-center text-white px-4">
      <div className="text-center">
        <Image
          src="/logo1.svg"
          width={250}
          height={200}
          alt="logo"
          className="mx-auto mb-8"
        />
        <h2 className="text-5xl font-bold mb-4">
          Eni Ghana Asset Management System
        </h2>
        <p className="text-lg mb-8">
          Manage your assets effortlessly and efficiently!
        </p>
        <Link
          href="/dashboard/home/overview"
          className="inline-block bg-white text-indigo-600 font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-gray-200 transition duration-300"
        >
          View Dashboard
        </Link>
      </div>
    </div>
  );
}
