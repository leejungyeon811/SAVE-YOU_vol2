import React from 'react';
import './TextPage.css';
import Nav from '../components/Nav'
import Intro from '../components/Intro';
import TextBox from '../components/TextBox';

const TextPage = () => {
    return (<>
        <header className="text_header">
          <Nav />
          <Intro />
        </header>
        <div className='text_component'>
          <TextBox/>
        </div>
    
      </>
      );
}

export default TextPage;
