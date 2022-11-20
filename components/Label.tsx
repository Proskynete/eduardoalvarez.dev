import React from "react";

const Label = ({ text, variant, ...rest }) => {
  return (
    <span className={`label ${variant}`} {...rest}>
      {text}
    </span>
  );
};

export default Label;
