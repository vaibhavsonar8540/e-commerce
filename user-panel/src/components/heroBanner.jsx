import React from "react";
import { LinkButton } from "./Buttons";
import CustomImage from "./customImage";

const HeroBanner = ({
  title = "",
  desc = "",
  titleClass = "",
  descClass = "",
  btnText = "",
  className = "",
  btnClassName = "",
  href = "",
  src = "",
  altAttr = "",
  titleAttr = "",
  contentClass = "",
  variant = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      <CustomImage
        srcAttr={src}
        altAttr={altAttr}
        titleAttr={titleAttr}
        className="w-full h-full object-cover"
      />

      <div className={`absolute ${contentClass}`}>
        <h1 className={`text-3xl ${titleClass}`}>{title}</h1>

        <p className={`text-base ${descClass}`}>{desc}</p>

        {btnText && (
          <LinkButton className={btnClassName} href={href} variant={variant}>
            {btnText}
          </LinkButton>
        )}
      </div>
    </div>
  );
};

export default HeroBanner;
