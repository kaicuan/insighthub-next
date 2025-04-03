import Navbar from '@/components/Navbar/Navbar';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}