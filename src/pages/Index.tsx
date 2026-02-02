import { ThoughtForm } from '@/components/ThoughtForm';
import { ThoughtFeed } from '@/components/ThoughtFeed';
import { useThoughts } from '@/hooks/useThoughts';

const Index = () => {
  const { thoughts, loading, posting, postThought } = useThoughts();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full animate-pulse-glow"
          style={{
            background: `radial-gradient(circle, hsl(var(--void-glow) / 0.04) 0%, transparent 70%)`
          }}
        />
        <div 
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full animate-pulse-glow"
          style={{
            background: `radial-gradient(circle, hsl(var(--void-pulse) / 0.03) 0%, transparent 70%)`,
            animationDelay: '1.5s'
          }}
        />
      </div>

      {/* Subtle grid pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      <main className="relative z-10 px-6 py-20 md:py-32 max-w-3xl mx-auto">
        {/* Header */}
        <header className="text-center mb-20 md:mb-28 void-header animate-fade-in">
          <div className="inline-block mb-6">
            <span className="font-mono text-xs text-primary/70 tracking-[0.3em] uppercase">
              Anonymous Thoughts
            </span>
          </div>
          <h1 className="font-mono text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-foreground mb-6 glow-text">
            THOUGHT DUMP
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto leading-relaxed">
            Write it. Release it.
            <span className="block mt-1 text-muted-foreground/60">
              You'll never see it again — only others will.
            </span>
          </p>
        </header>

        {/* Thought Form */}
        <section className="animate-fade-in-delayed">
          <ThoughtForm onSubmit={postThought} isPosting={posting} />
        </section>

        {/* Feed */}
        <section>
          <ThoughtFeed thoughts={thoughts} loading={loading} />
        </section>
      </main>
    </div>
  );
};

export default Index;
