import "./index.scss";
import match from "../../../../assets/images/match.svg";
import ArsenalImage from "../../../../assets/images/arsenal.png";
import ChelseaImage from "../../../../assets/images/chelsea.png";
import { DropDown } from "../../../../components/ui/dropdown";
import { useState } from "react";
import image1 from "../../../../assets/images/leagues/image1.png";
import image2 from "../../../../assets/images/leagues/image2.png";
import image3 from "../../../../assets/images/leagues/image3.png";
import image4 from "../../../../assets/images/leagues/image4.png";
import image5 from "../../../../assets/images/leagues/image5.png";
import image6 from "../../../../assets/images/leagues/image6.png";
const Game = ({ icon, name, icon2, name2, goals }) => {
  return (
    <div className="fix__match">
      <div className="fix__match__team">
        <div className="title">{name}</div>
        <img src={icon} alt="" />
      </div>
      <div className="fix__match__noun">
        <img src={match} alt="" />
        <span>{goals}</span>
      </div>
      <div className="fix__match__team">
        <img src={icon2} alt="" />
        <div className="title">{name2}</div>
      </div>
    </div>
  );
};

const testDays = [
  { label: "Matchday 15", value: "15" },
  { label: "Matchday 26", value: "26" },
  { label: "Matchday 30", value: "30" },
];

const testYears = [
  { label: "2021-2022", value: "21" },
  { label: "2023-2024", value: "23" },
  { label: "2024-2025", value: "24" },
];

const testLeagues = [
  { label: "Premier League", value: "premier", icon: image1 },
  { label: "Special Offer", value: "sp", icon: image2 },
];

export function FixturesAuth() {
  const [selectedMatchDay, setSelectedMatchDay] = useState(testDays[0]);
  const [selectedYear, setSelectedYear] = useState(testYears[0]);
  const [selectedLeague, setSelectedLeague] = useState(testLeagues[0]);
  return (
    <div className="fix">
      <div className="container">
        <div className="fix__top">
          <div className="fix__top__title">FIXTURES</div>
          <div className="fix__top__selectors">
            <DropDown
              selectedOption={selectedLeague}
              isHaveIcon={true}
              options={testLeagues}
              select={setSelectedLeague}
            />
            <DropDown
              selectedOption={selectedMatchDay}
              select={(e) => setSelectedMatchDay(e)}
              options={testDays}
            />
            <DropDown
              selectedOption={selectedYear}
              options={testYears}
              select={setSelectedYear}
            />
          </div>
        </div>
        <div className="fix__blocks">
          <div className="fix__block">
            <div className="fix__block__top">
              <div className="title">Tuesday 3 December 2024</div>
              <div className="time">21:30</div>
            </div>
            <div className="fix__block__content">
              <Game
                icon={ArsenalImage}
                name="Liverpool"
                icon2={ChelseaImage}
                name2="Arsenal"
                goals="0:0"
              />
              <Game
                icon={ArsenalImage}
                name="Liverpool"
                icon2={ChelseaImage}
                name2="Arsenal"
                goals="0:0"
              />
              <Game
                icon={ArsenalImage}
                name="Liverpool"
                icon2={ChelseaImage}
                name2="Arsenal"
                goals="0:0"
              />
              <Game
                icon={ArsenalImage}
                name="Liverpool"
                icon2={ChelseaImage}
                name2="Arsenal"
                goals="0:0"
              />
            </div>
          </div>
          <div className="fix__block">
            <div className="fix__block__top">
              <div className="title">Tuesday 3 December 2024</div>
              <div className="time">00:15</div>
            </div>
            <div className="fix__block__content">
              <Game
                icon={ArsenalImage}
                name="Liverpool"
                icon2={ChelseaImage}
                name2="Arsenal"
                goals="0:0"
              />
              <Game
                icon={ArsenalImage}
                name="Liverpool"
                icon2={ChelseaImage}
                name2="Arsenal"
                goals="0:0"
              />
              <Game
                icon={ArsenalImage}
                name="Liverpool"
                icon2={ChelseaImage}
                name2="Arsenal"
                goals="0:0"
              />
              <Game
                icon={ArsenalImage}
                name="Liverpool"
                icon2={ChelseaImage}
                name2="Arsenal"
                goals="0:0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
