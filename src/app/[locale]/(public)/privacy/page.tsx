import {Container} from '@/components/ui/Container';
import {Section} from '@/components/layout/Section';
import {Heading} from '@/components/ui/Heading';
import {Text} from '@/components/ui/Text';

export default function PrivacyPage() {
  return (
    <Section>
      <Container>
        <Heading level={1}>Privacy Policy</Heading>
        <Text>This page will contain privacy policy details for users.</Text>
      </Container>
    </Section>
  );
}
