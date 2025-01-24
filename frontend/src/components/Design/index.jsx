import useInView from "../../utils/useInView";
import "./index.scss";
import Line1 from "../../assets/images/line-1.png";
import Line2 from "../../assets/images/line-2.png";
import Line3 from "../../assets/images/line-3.png";
import Line4 from "../../assets/images/line-4.png";
const DesignComponent = ({ children }) => {
  const [line1Ref, is1Visible] = useInView(0, { threshold: 0.1 });
  const [line2Ref, is2Visible] = useInView(0, { threshold: 0.15 });
  const [line3Ref, is3Visible] = useInView(0, { threshold: 0.2 });
  const [line4Ref, is4Visible] = useInView(0, { threshold: 0.25 });
  return (
    <div className="design">
      <div className="placeholder" ref={line1Ref}></div>
      <div className="placeholder" ref={line2Ref}></div>
      <div className="placeholder" ref={line3Ref}></div>
      <div className="placeholder" ref={line4Ref}></div>
      <div className={is1Visible ? "line-visible line1" : "line1"}>
        <img src={Line1} alt="line" />
      </div>
      <div className={is2Visible ? "line-visible line2" : "line2"}>
        <img src={Line2} alt="line" />
      </div>
      <div className={is3Visible ? "line-visible line3" : "line3"}>
        <img src={Line3} alt="line" />
      </div>
      <div className={is4Visible ? "line-visible line4" : "line4"}>
        <img src={Line4} alt="line" />
      </div>
      <div className="design__content">{children}</div>
    </div>
  );
};

export default DesignComponent;
