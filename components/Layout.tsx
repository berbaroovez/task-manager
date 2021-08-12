import { FunctionComponent } from "react";
import styled from "styled-components";
const Layout: FunctionComponent = ({ children }) => {
  return <LayoutDiv>{children}</LayoutDiv>;
};

const LayoutDiv = styled.div`
  /* background-color: red; */
  width: 100%;
  /* height: 100vh; */
  /* padding: 0 20px; */
`;
export { Layout };
