import data from '../Data.json';
import About from '../components/About/About';
import Iconbox from '../components/Iconbox/Iconbox';
import Skill from '../components/Skill/Skill';
import Resume from '../components/Resume/ResumeSection';
import PortfolioSection from '../components/Protfolio/PortfolioSection';
import Hero from '../components/Hero/Hero.jsx';
import Footer from '../components/Footer/Footer.jsx';
import SocialLinks from '../components/SocialLinks/SocialLinks.jsx';

const Home = ({ heroData, aboutData, serviceData, skillData, portfolioData, resumeData, socialData }) => {
  return (
    <>
      <Hero data={heroData.homeHero} socialData={socialData} />
      <About data={aboutData} data-aos="fade-right" />
      <Iconbox data={serviceData} data-aos="fade-right" />
      <Skill data={skillData} data-aos="fade-right" />
      <Resume data={resumeData} />
      <PortfolioSection data={portfolioData} data-aos="fade-right" />

    </>
  )
}

export default Home;
