import './Footer.scss';
import SocialLinks from '../SocialLinks/SocialLinks';

const Footer = ({ socialData }) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();


  const showTitles = true;

  return (
    <footer>
      <div className="container">
        <SocialLinks data={socialData} showTitle={true} enableAos={false} />
      </div>
    </footer>
  )
}

export default Footer;
