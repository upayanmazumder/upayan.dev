import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <section className="text-center min-h-full">
        <h1 className="text-4xl font-bold mb-4">Welcome to Upayan</h1>
        <p className="text-lg mb-8">
          Your one-stop solution for web development.
        </p>
        <Image src="/upayan.svg" alt="Upayan Logo" width={200} height={200} />
      </section>
      <section id="projects" className="text-center min-h-full">
        <h2 className="text-3xl font-bold mb-4">Projects</h2>
        <p className="text-lg mb-8">
          Explore my projects and contributions to the web development
          community.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 border rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Project 1</h3>
            <p className="text-sm">Description of project 1.</p>
          </div>
          <div className="p-4 border rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Project 2</h3>
            <p className="text-sm">Description of project 2.</p>
          </div>
          <div className="p-4 border rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Project 3</h3>
            <p className="text-sm">Description of project 3.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
