import PropTypes from 'prop-types';
import './Portfolio.scss';
import SectionHeading from '../SectionHeading/SectionHeading';
import { useState } from 'react';
import SinglePortfolio from './SinglePortfolio';
import Modal from '../Modal/Modal';

const PortfolioSection = ({ data }) => {
  // Modal
  const [modal, setModal] = useState(false);
  const [tempData, setTempData] = useState([]);

  const getData = (imgLink, title, subTitle, text) => {
    let tempData = [imgLink, title, subTitle, text];
    setTempData(item => [1, ...tempData]);
    setModal(true);
  }

  const modalClose = () => {
    setModal(false);
  }

  // Load Items
  const { portfolioItems } = data;
  const itemsPerPage = 3;
  const [visibleItems, setVisibleItems] = useState(
    portfolioItems.slice(0, itemsPerPage),
  );

  const loadMoreItems = () => {
    const currentLength = visibleItems.length;
    const nextChunk = portfolioItems.slice(
      currentLength,
      currentLength + itemsPerPage,
    );
    setVisibleItems(prevItems => [...prevItems, ...nextChunk]);
  };

  return (
    <>
      <section id="portfolio">
        <div className="st-height-b100 st-height-lg-b80"></div>
        <SectionHeading title={'Portfolio'} />
        <div className="container">
          <div className="row">
            {visibleItems.map((element, index) => (
              <SinglePortfolio data={element} key={index} getData={getData} />
            ))}
            <div className="col-lg-12 text-center">
              <div className="st-portfolio-btn">
                {visibleItems.length < portfolioItems.length && (
                  <button
                    className="st-btn st-style1 st-color1"
                    onClick={loadMoreItems}
                  >
                    Load more
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="st-height-b100 st-height-lg-b80"></div>
      </section>
      {modal && <Modal img={tempData[1]} title={tempData[2]} subTitle={tempData[3]} text={tempData[4]} modalClose={modalClose} />}
    </>
  );
};

PortfolioSection.propTypes = {
  data: PropTypes.object.isRequired,
};

export default PortfolioSection;