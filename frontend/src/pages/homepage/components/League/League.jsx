import { useSelector } from "react-redux";
import "./index.scss";
import SlideImage1 from "../../../../assets/images/slide-1.png";
import stepIcon from "../../../../assets/images/LeagueStep.svg";
export default function Leagues() {
  const user = useSelector((state) => state.user.user);
  console.log(user);
  const name = user?.fullName;
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
              <tr className="leagues__table__col">
                <td>
                  <div className="leagues__table__col__title">
                    <img src={SlideImage1} alt="" />
                    Premiere League
                  </div>
                </td>
                <td>H2M</td>
                <td>9532</td>
                <td>Live</td>
                <td style={{ textAlign: "center" }}>
                  25 Dec 2024 <br />
                  21:15
                </td>

                <td>
                  <div className="leagues__table__col__price">
                    <div className="leagues__table__col__price__new">
                      20 000AMD
                    </div>
                    <div className="leagues__table__col__price__old">
                      49 990AMD{" "}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="leagues__table__col__buttons">
                    <div className="leagues__table__col__try">Try</div>
                    <div className="leagues__table__col__buy">Buy</div>
                  </div>
                </td>
              </tr>
              <tr className="leagues__table__col">
                <td>
                  <div className="leagues__table__col__title">
                    <img src={SlideImage1} alt="" />
                    Premiere League
                  </div>
                </td>
                <td>H2M</td>
                <td>9532</td>
                <td>Live</td>
                <td style={{ textAlign: "center" }}>
                  25 Dec 2024 <br />
                  21:15
                </td>

                <td>
                  <div className="leagues__table__col__price">
                    <div className="leagues__table__col__price__new">
                      20 000AMD
                    </div>
                    <div className="leagues__table__col__price__old">
                      49 990AMD{" "}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="leagues__table__col__buttons">
                    <div className="leagues__table__col__try">Try</div>
                    <div className="leagues__table__col__buy">Buy</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
