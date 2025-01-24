import "./index.scss";
import ArrowImage from "../../../assets/images/arrow-drop.svg";
import { useState } from "react";
import useOutsideClickDetector from "../../../utils/outside";

export const DropDown = ({
  options,
  selectedOption,
  select,
  isHaveIcon,
  icon,
}) => {
  const title = isHaveIcon ? selectedOption.value : selectedOption;
  const { isOpen, setIsOpen, ref } = useOutsideClickDetector(false);

  return (
    <div className="dn">
      <div
        className="dn__title"
        onClick={(e) => {
          setIsOpen(!isOpen);
        }}
      >
        <span>
          {isHaveIcon && <img src={icon} />} {title}
        </span>
        <img
          src={ArrowImage}
          style={{ rotate: isOpen ? "180deg" : "0deg" }}
          alt=""
        />
      </div>
      {isOpen && (
        <div
          ref={ref}
          className={`dn__content${isOpen ? " dn__content__open" : ""}`}
        >
          {options.map((e) => {
            const title = isHaveIcon ? e.value : e;
            return (
              <div className="dn__content__item" onClick={() => select(e)}>
                {isHaveIcon && <img src={e.icon} />}
                {title}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
