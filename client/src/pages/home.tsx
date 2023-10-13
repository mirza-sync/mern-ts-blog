import { Container } from 'reactstrap';

import Header from '../components/Header';
import Navigation from '../components/Navigation';

const HomePage = () => {
  return (
    <Container fluid className="p-0">
      <Navigation />
      <Header
        title="A Nerdy Blog Website"
        headline="Check out what people have to say!"
      />
      <Container>Blog stuff here...</Container>
    </Container>
  );
};

export default HomePage;
