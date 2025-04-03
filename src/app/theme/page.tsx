import ThemeToggle from '@/components/ThemeToggle';

export default function ColorShowcase() {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Theme</h1>
        <ThemeToggle />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Primary', variable: '--color-primary' },
          { name: 'Secondary', variable: '--color-secondary' },
          { name: 'Accent', variable: '--color-accent' },
          { name: 'Background', variable: '--color-background' },
          { name: 'Foreground', variable: '--color-foreground' },
          { name: 'Border', variable: '--color-border' },
        ].map(({ name, variable }) => (
          <div
            key={name}
            className="p-4 rounded-lg border border-border shadow-sm transition-shadow duration-200 hover:shadow-lg"
            style={{ backgroundColor: 'var(--color-card)' }}
          >
            <div
              className="w-16 h-16 rounded mb-2"
              style={{ backgroundColor: `var(${variable})` }}
            />
            <div className="space-y-1">
              <div className="font-medium">{name}</div>
              <div className="text-sm text-muted-foreground">{variable}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}