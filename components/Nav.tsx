import styled from "styled-components";
import Link from "next/link";

const Nav = () => {
  return (
    <NavDiv>
      <h1>TaskManager</h1>
      <NavLinks>
        <Link href="/pastweeks">
          <a>Past Weeks</a>
        </Link>
        <Link href="/dashboard">
          <a>Dashboard</a>
        </Link>
      </NavLinks>
    </NavDiv>
  );
};

const NavDiv = styled.nav`
  display: grid;
  justify-content: center;
  align-content: center;
  width: 100%;
  height: 100px;
  background-color: #c22e2e;
  text-align: center;
  h1 {
    font-family: "Special Elite", cursive;
    font-size: 2em;
  }
  p {
    font-size: 0.8em;
  }
  margin-bottom: var(--section-margin);
`;

const NavLinks = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

export { Nav };
