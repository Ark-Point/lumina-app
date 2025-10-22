"use client";

import { HeaderArea, HeaderContainer, LogoImage, LogoWrapper } from "./style";
const Header = () => {
  const InternalRoute = { HOME: "/" };

  return (
    <HeaderContainer>
      <HeaderArea aria-label="main-navigation">
        <LogoWrapper
          onClick={() => {
            window.location.href = InternalRoute.HOME;
          }}
        >
          <LogoImage alt="" />
        </LogoWrapper>
        {"Welcome arkpoint"}
      </HeaderArea>
    </HeaderContainer>
  );
};

export default Header;
