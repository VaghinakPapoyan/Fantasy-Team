import { useSelector } from "react-redux";
import "./index.scss";
import image1 from "../../../../assets/images/leagues/image1.png";
import image2 from "../../../../assets/images/leagues/image2.png";
import image3 from "../../../../assets/images/leagues/image3.png";
import image4 from "../../../../assets/images/leagues/image4.png";
import image5 from "../../../../assets/images/leagues/image5.png";
import image6 from "../../../../assets/images/leagues/image6.png";
import stepIcon from "../../../../assets/images/LeagueStep.svg";

const LeagueItem = ({
  logo,
  title,
  score,
  part,
  draft,
  start,
  price,
  oldPrice,
}) => {
  return (
    <tr className="leagues__table__col">
      <td>
        <div className="leagues__table__col__title">
          <img src={logo} alt="" />
          {title}
        </div>
      </td>
      <td>{score}</td>
      <td>{part}</td>
      <td>{draft}</td>
      <td style={{ textAlign: "center" }}>{start}</td>

      <td>
        <div className="leagues__table__col__price">
          <div className="leagues__table__col__price__new">{price}</div>
          <div className="leagues__table__col__price__old">{oldPrice} </div>
        </div>
      </td>
      <td>
        <div className="leagues__table__col__buttons">
          <div className="leagues__table__col__try">Try</div>
          <div className="leagues__table__col__buy">Buy</div>
        </div>
      </td>
    </tr>
  );
};

export default function Leagues() {
  const user = useSelector((state) => state.user.user);
  console.log(user);
  const name = user?.fullName;
  const testData = [
    {
      logo: image1,
      title: "Premier League",
      score: "H2H",
      part: "9532",
      draft: "live",
      start: "25 Dec 2024 21:15",
      price: "20,000AMD",
      oldPrice: "34,990AMD",
    },
    {
      logo: image2,
      title: "Special offer",
      score: "H2H",
      part: "10 254",
      draft: "live",
      start: "20 Jan 2024 18:00",
      price: "24 999AMD",
      oldPrice: "49 990AMD",
    },
    {
      logo: image3,
      title: "UEFA",
      score: "H2H",
      part: "785",
      draft: "live",
      start: "26 Jan 2024 11:30",
      price: "17 500AMD",
      oldPrice: "29 990AMD",
    },
    {
      logo: image4,
      title: "Serie A",
      score: "H2H",
      part: "103",
      draft: "live",
      start: "18 Jan 2024 23:45",
      price: "17 500AMD",
      oldPrice: "29 990AMD",
    },
    {
      logo: image5,
      title: "Bundesliga ",
      score: "H2H",
      part: "762",
      draft: "live",
      start: "18 Jan 2024 23:45",
      price: "20 000AMD",
      oldPrice: "34 900AMD",
    },
    {
      logo: image6,
      title: "Laliga ",
      score: "H2H",
      part: "3071",
      draft: "live",
      start: "18 Jan 2024 23:45",
      price: "17 500AMD",
      oldPrice: "29 900AMD",
    },
  ];
  return (
    <div className="leagues">
      <div className="container">
        <div className="leagues__top">
          <div className="leagues__top__left">
            <div className="title">
              WELCOME <br /> <span>{name}</span>
            </div>
            <div className="subtitle">
              You're on your way to achieving your goal! <br /> Select a league
              to get started.
            </div>
          </div>
          <div className="leagues__top__right">
            <img src={stepIcon} width="84px" height="84px" alt="" />
            <div className="text">Make Your Picks Now</div>
          </div>
        </div>
        <div className="leagues__bottom">
          <div className="leagues__bottom__head">
            <div className="title">Join a League</div>
            <div className="subtitle">
              Compete, connect, and climb the leaderboard in public or private
              leagues!
            </div>
          </div>
          <table className="leagues__table">
            <thead>
              <tr>
                <th style={{ width: "27%" }}>League name</th>
                <th style={{ width: "9%" }}>Scoring</th>
                <th style={{ width: "10%" }}>Participants</th>
                <th style={{ width: "10%" }}>Draft</th>
                <th style={{ width: "13%" }}>Starts day</th>
                <th style={{ width: "14%" }}>Price</th>
                <th style={{ width: "15%" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {testData.map((e) => {
                return <LeagueItem {...e} key={e.part} />;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
