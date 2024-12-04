import React from 'react';
import './PicturePage.css';
import Nav from '../components/Nav'
import Intro from '../components/Intro';
import UploadArea from '../components/UploadArea';
// import RadioButton from '../components/RadioButton';

const PicturePage = () => {
  return (<>
    <header className="picture_header">
      <Nav />
      <Intro />
    </header>
    <div className='pic_component'>
      {/* <RadioButton /> */}
      <UploadArea />
    </div>

  </>
  );
}

export default PicturePage;
