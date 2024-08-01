import PropTypes from 'prop-types';
import React from 'react';
import './Hero.scss';
import perser from 'html-react-parser';
import SocialLinks from '../SocialLinks/SocialLinks.jsx';
import WaterWave from 'react-water-wave';

const Hero = ({ data, socialData }) => {
  const { title, text, imgAuthor, bgImgLink } = data;
  // console.log('her3');
  // console.log(socialData);

  return (
    <WaterWave id="home" className="st-hero st-style2 st-bg st-dynamic-bg st-ripple-version" imageUrl={bgImgLink}>
      {() => (
        <div className="container">
          <div className="st-hero-text">
            <div className="st-author" data-aos="fade-up" data-aos-duration="800" data-aos-delay="200">
              <img src={imgAuthor} alt="Author Image" />
            </div>
            <h1 data-aos="fade-up" data-aos-duration="800" data-aos-delay="300">{perser(title)}</h1>
            <p data-aos="fade-up" data-aos-duration="800" data-aos-delay="400">{perser(text)}</p>
            <SocialLinks data={socialData} />
          </div>
        </div>
      )}
    </WaterWave>
  )
}

Hero.propTypes = {
  data: PropTypes.object,
  socialData: PropTypes.array,
};


export default Hero;
