import React from "react";
import { Link } from "react-router-dom";
import ArrowImage from "../../assets/images/arrow.png";
import logoImage from "../../assets/images/logo-image.png";
import bellImage from "../../assets/images/bell.svg";
import userImage from "../../assets/images/user.svg";

import "./styles.scss";
import { useSelector } from "react-redux";

export default function Header({ openRegistrationModal }) {
  const { user } = useSelector((state) => state.user);

  if (user) {
    return (
      <header className="header">
        <div className="container">
          <div className="logo">
            <img src={logoImage} alt="" />
          </div>
          <div className="nav">
            <ul>
              <li>
                <Link to="/all-leagues">All leagues</Link>
              </li>
              <li>
                <Link to="/get-bonuses">Get bonuses</Link>
              </li>
              <li>
                <Link to="/prizes">Prizes</Link>
              </li>
              <li>
                <Link to="/hot-to-play">How to play</Link>
              </li>
              <li>
                <Link to="/leaderboard">Leaderboard</Link>
              </li>
              <li className="pr dropdown-container">
                <button>
                  Help center <img src={ArrowImage} alt="arrow" />
                </button>
                {/* dropdown */}
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/faq">FAQ</Link>
                  </li>
                  <li>
                    <Link to="/rules">Rules</Link>
                  </li>
                  <li>
                    <Link to="/contact-us">Contact Us</Link>
                  </li>
                  <li>
                    <Link to="/terms-of-use">Terms Of Use</Link>
                  </li>
                  <li>
                    <Link to="/privacy-policy">Privacy Policy</Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div className="right">
            <div className="left">
              <img src={bellImage} alt="bell" />
            </div>
            <div className="right">
              <img src={userImage} alt="user" />
              <img src={ArrowImage} alt="arrow" />
            </div>
          </div>
        </div>
      </header>
    );
  } else {
    return (
      <header className="header">
        <div className="container">
          <div className="logo">
            <img src={logoImage} alt="" />
          </div>
          <div className="nav">
            <ul>
              <li>
                <Link to="/all-leagues">All leagues</Link>
              </li>
              <li>
                <Link to="/hot-to-play">How to play</Link>
              </li>
              <li className="pr dropdown-container">
                <button>
                  Help center <img src={ArrowImage} alt="arrow" />
                </button>
                {/* dropdown */}
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/faq">FAQ</Link>
                  </li>
                  <li>
                    <Link to="/rules">Rules</Link>
                  </li>
                  <li>
                    <Link to="/contact-us">Contact Us</Link>
                  </li>
                  <li>
                    <Link to="/terms-of-use">Terms Of Use</Link>
                  </li>
                  <li>
                    <Link to="/privacy-policy">Privacy Policy</Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div className="right">
            <div className="languages pr dropdown-container">
              Eng
              <img src={ArrowImage} alt="arrow" />
              {/* dropdown */}
              <ul className="dropdown-menu dropdown-menu-sm">
                <li>
                  <Link>
                    <button>Eng</button>
                  </Link>
                </li>
                <li>
                  <Link>
                    <button>Rus</button>
                  </Link>
                </li>
                <li>
                  <Link>
                    <button>Arm</button>
                  </Link>
                </li>
              </ul>
            </div>
            <button
              onClick={() => openRegistrationModal()}
              className="btn sign-up"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>
    );
  }
}
