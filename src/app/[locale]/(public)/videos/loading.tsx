import {Container} from '@/components/ui/Container';
import {Section} from '@/components/layout/Section';
import {Skeleton} from '@/components/ui/Skeleton';
import {Card} from '@/components/ui/Card';
import {Grid} from '@/components/layout/Grid';

export default function VideosPageLoading() {
  return (
    <Section>
      <Container className="space-y-8 pb-16">
        <Card className="overflow-hidden border-art-sage/60 bg-gradient-to-br from-art-cream via-art-beige to-art-sage/15 p-6 md:p-8">
          <div className="space-y-4">
            <Skeleton className="h-4 w-32 rounded-full" />
            <Skeleton className="h-14 w-3/4 max-w-3xl rounded-2xl" />
            <Skeleton className="h-6 w-full max-w-2xl rounded-full" />
            <div className="flex flex-wrap gap-3 pt-2">
              <Skeleton className="h-8 w-28 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          </div>
        </Card>

        <Card className="space-y-4 border-art-sage/60 bg-art-cream/95 p-4 md:p-5">
          <Skeleton className="h-12 w-full rounded-full" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-7 w-24 rounded-full" />
            <Skeleton className="h-7 w-28 rounded-full" />
            <Skeleton className="h-7 w-20 rounded-full" />
          </div>
        </Card>

        <Grid cols={4} className="sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {Array.from({length: 8}).map((_, index) => (
            <Skeleton key={index} height="22rem" className="rounded-[1.5rem] border border-art-sage/40 bg-art-beige/80" />
          ))}
        </Grid>

        <Card className="space-y-4 border-art-sage/60 bg-art-cream/95 p-4 md:p-5">
          <Skeleton className="h-10 w-full rounded-full md:w-1/2" />
          <Skeleton className="h-5 w-full rounded-full md:w-48" />
        </Card>
      </Container>
    </Section>
  );
}
