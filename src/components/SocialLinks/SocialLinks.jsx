import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';

const SocialLinks = ({ data, showTitle = false, enableAos = true }) => {
  const isEmail = (link) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(link);

  return (
    <div
      className={`st-hero-social-links ${showTitle ? 'with-title' : ''}`}
      data-aos={enableAos ? "fade-up" : undefined}
      data-aos-duration={enableAos ? "800" : undefined}
      data-aos-delay={enableAos ? "500" : undefined}
    >
      {data.map((item, index) => (
        <div className="st-social-item" key={index}>
          <a
            href={isEmail(item.link) ? `mailto:${item.link}` : item.link}
            className="st-social-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="st-social-icon"><Icon icon={item.icon} /></span>
          </a>
          {showTitle && <span className="st-social-title">{item.title}</span>}
        </div>
      ))}
    </div>
  )
}

SocialLinks.propTypes = {
  data: PropTypes.array.isRequired,
  showTitle: PropTypes.bool,
  enableAos: PropTypes.bool,
}

export default SocialLinks;
