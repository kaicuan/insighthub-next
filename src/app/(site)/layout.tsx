import Navbar from '@/components/navbar/navbar';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <div className="pt-16">
        {children}
      </div>
    </div>
  );
}