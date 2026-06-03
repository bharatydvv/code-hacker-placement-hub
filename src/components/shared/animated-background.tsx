export function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-glow" />
      <div className="absolute top-1/3 right-1/4 h-96 w-96 rounded-full bg-secondary/20 blur-3xl animate-glow" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-0 left-1/2 h-80 w-80 rounded-full bg-accent/10 blur-3xl animate-glow" style={{ animationDelay: '1s' }} />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
    </div>
  );
}
