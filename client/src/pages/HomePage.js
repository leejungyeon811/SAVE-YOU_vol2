import React from 'react';
import './HomePage.css';
import Nav from '../components/Nav'
import Intro from '../components/Intro';


const HomePage = () => {
    return (
        <div >
            <Nav />
            <section id="home_intro"><Intro /></section>
            <div className="intro__text">
                <div className="text">
                    <div>Secure</div>
                    <div>Your Moments</div>
                </div>
                <div className="img">
                    {/* <img src='/asset/childrenPic.jpg' alt="picture" /> */}
                </div>
            </div>
            <div className="intro__lines bottom" aria-hidden="true">
                <span className="line"></span>
                <span className="line"></span>
                <span className="line"></span>
                <span className="line"></span>
                <span className="line"></span>
                <span className="line"></span>
            </div>
        </div>
    );
}

export default HomePage;
