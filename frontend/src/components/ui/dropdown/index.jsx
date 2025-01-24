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
  const title = selectedOption.label;
  const { isOpen, setIsOpen, ref } = useOutsideClickDetector(false);

  return (
    <div className="dn">
      <div
        className="dn__title"
        onClick={(e) => {
          setIsOpen(true);
        }}
      >
        {isHaveIcon && <img src={selectedOption.icon} width={40} height={50} />}
        <span>{title}</span>
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
            const title = e.label;
            return (
              <div
                className="dn__content__item"
                onClick={() => {
                  select(e);
                  setIsOpen(false);
                }}
              >
                {isHaveIcon && <img width={40} height={50} src={e.icon} />}
                {title}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
