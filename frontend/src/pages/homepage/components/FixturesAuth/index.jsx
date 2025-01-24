import "./index.scss";
import match from "../../../../assets/images/match.svg";
import ArsenalImage from "../../../../assets/images/arsenal.png";
import ChelseaImage from "../../../../assets/images/chelsea.png";
import { DropDown } from "../../../../components/ui/dropdown";
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

export function FixturesAuth() {
  return (
    <div className="fix">
      <div className="container">
        <div className="fix__top">
          <div className="fix__top__title">FIXTURES</div>
          <div className="fix__top__selectors">
            <DropDown selectedOption={"15"} options={["15", "2"]} />
            <DropDown
              selectedOption={"Matchday 15"}
              options={["Matchday 17", " Matchday 2"]}
            />
            <DropDown
              selectedOption={"2024-2025"}
              options={["2023-2024", "2022-2023"]}
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
                name="Arsenal"
                icon2={ChelseaImage}
                name2="Chelsea"
                goals="0:0"
              />
            </div>
          </div>
          <div className="fix__block">
            <div className="fix__block__top">
              <div className="title">Tuesday 3 December 2024</div>
              <div className="time">21:30</div>
            </div>
            <div className="fix__block__content">
              <Game
                icon={ArsenalImage}
                name="Arsenal"
                icon2={ChelseaImage}
                name2="Chelsea"
                goals="0:0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
