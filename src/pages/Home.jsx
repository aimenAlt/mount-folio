import Hero from '../components/Hero/Hero';
import Machine from '../components/Machine/Machine';
import Stakes from '../components/Stakes/Stakes';
import Work from '../components/Work/Work';
import About from '../components/About/About';
import Contact from '../components/Contact/Contact';
import Footer from '../components/Footer/Footer';

const Home = ({ hero, machine, projects, about, contact, footer }) => (
  <>
    <Hero data={hero} />
    <Machine data={machine} />
    <Stakes />
    <Work projects={projects} />
    <About data={about} />
    <Contact data={contact} />
    <Footer data={footer} />
  </>
);

export default Home;
