import About from '@/components/About';
import Hero from '@/components/Hero';

export default function Home() {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <Hero />
      <About />
    </main>
  );
}
