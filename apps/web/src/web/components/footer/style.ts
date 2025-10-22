import { css } from '@emotion/react';
import styled from '@emotion/styled';

const footerTextStyle = css`
  color: white;
`;

export const FooterContainer = styled.footer`
  display: flex;
  align-items: center;
  width: 100%;
  height: 150px;
  background-color: primary;
`;

export const FooterIconBox = styled.div`
  width: 32px;
  height: 32px;
`;

export const FooterCopyRightText = styled.small`
  ${footerTextStyle}
`;
