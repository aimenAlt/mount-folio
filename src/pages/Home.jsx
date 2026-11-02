import Hero from '../components/Hero/Hero';
import Platform from '../components/Platform/Platform';
import Machine from '../components/Machine/Machine';
import Stakes from '../components/Stakes/Stakes';
import Work from '../components/Work/Work';
import About from '../components/About/About';
import Contact from '../components/Contact/Contact';

const Home = ({ hero, platform, machine, projects, about, contact }) => (
  <>
    <Hero data={hero} resume={contact.resume} />
    <Platform data={platform} />
    <Work projects={projects} />
    <Machine data={machine} />
    <Stakes />
    <About data={about} />
    <Contact data={contact} />
  </>
);

export default Home;
