import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { links } from '@/lib/navbar-links'

export default function DesktopNavLinks() {
  const pathname = usePathname();
  return (
    <div className="hidden sm:flex">
      {links.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex items-center h-full text-muted-foreground hover:text-primary px-4",
              {
                "border-b-3 border-primary text-primary": pathname === link.href,
              }
            )}
          >{link.name}</Link>
        );
      })}
    </div>
  );
}