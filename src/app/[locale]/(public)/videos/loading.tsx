import {Container} from '@/components/ui/Container';
import {Heading} from '@/components/ui/Heading';
import {Section} from '@/components/layout/Section';
import {Grid} from '@/components/layout/Grid';
import {Skeleton} from '@/components/ui/Skeleton';

export default function VideosPageLoading() {
  return (
    <Section>
      <Container className="space-y-8">
        <div className="space-y-3">
          <Heading level={1}>Video Library</Heading>
          <Skeleton className="h-5 w-72" />
        </div>

        <Grid cols={4}>
          {Array.from({length: 8}).map((_, index) => (
            <Skeleton key={index} height="240px" className="rounded-gentle" />
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
