import {Container} from '@/components/ui/Container';
import {Section} from '@/components/layout/Section';
import {Heading} from '@/components/ui/Heading';
import {Text} from '@/components/ui/Text';

export default function TermsPage() {
  return (
    <Section>
      <Container>
        <Heading level={1}>Terms of Service</Heading>
        <Text>This page will contain terms and service conditions for the platform.</Text>
      </Container>
    </Section>
  );
}
