import React from "react";

interface ButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  title: string;
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({ onClick, title, style }) => {
  const buttonStyle = {
    display: "block",
    margin: "10px auto",
    ...(style ? style : {}),
  };
  return (
    <button className="controls-button" style={buttonStyle} onClick={onClick}>
      {title}
    </button>
  );
};

export default Button;
