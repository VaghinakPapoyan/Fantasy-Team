import "./index.scss";
import image from "../../../../assets/images/homeIpad.png";
export function HomeSection() {
  return (
    <div className="reklam">
      <div className="container">
        <img src={image} alt="" />
        <div className="content">
          <div className="content__title">You're so close!</div>
          <div className="content__line"></div>
          <div className="content__text">
            Choose a league, build your dream team, and start winning.
          </div>
          <div className="content__text2">
            Using your allocated budget, build your best 11-man team and choose
            a captain. Players' prices are based on real match odds
          </div>
        </div>
      </div>
    </div>
  );
}
