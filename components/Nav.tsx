import styled from "styled-components";
import Link from "next/link";
import { useAuth } from "../util/Auth";
const Nav = () => {
  const { user, signIn } = useAuth();
  return (
    <NavDiv>
      <NavLogo>
        <Link href="/">
          <a>TaskManager</a>
        </Link>
      </NavLogo>
      <NavLinks>
        <Link href="/pastweeks">
          <a>Past Weeks</a>
        </Link>
        <Link href="/leaderboard">
          <a>Leader Board</a>
        </Link>

        {user ? (
          <Link href="/dashboard">
            <a>Dashboard</a>
          </Link>
        ) : (
          <p onClick={signIn}>Sign In</p>
        )}
      </NavLinks>
    </NavDiv>
  );
};

const NavDiv = styled.nav`
  padding: 0 100px;
  display: grid;
  grid-template-columns: fit-content(8ch) fit-content(600px);
  justify-content: space-between;
  align-content: center;
  width: 100%;
  height: 100px;
  background-color: var(--red-color);
  text-align: center;
  h1 {
    font-family: "Special Elite", cursive;
    font-size: 2em;
  }
  /* p {
    font-size: 0.8em;
  } */
  margin-bottom: var(--section-margin);
`;

const NavLinks = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 8px;

  a,
  p {
    text-align: center;
    font-family: "Special Elite", cursive;
    padding: 5px 10px;
    padding-top: 7px;
    /* background-color: #f7d1bf; */
    border: 2px var(--creme-color) solid;
    border-radius: 8px;
    color: var(--creme-color);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
      background-color: var(--creme-color);
      color: var(--red-color);
    }
  }

  p {
    cursor: pointer;
  }
`;

// const NavLink = styled(Link)`
//   background-color: blue;
//   a {
//     background-color: white;
//   }
// `;

const NavLogo = styled.div`
  text-align: center;
  font-family: "Special Elite", cursive;
  padding: 5px 10px;
  padding-top: 9px;

  background-color: var(--creme-color);
  border-radius: 8px;

  a {
    text-decoration: none;
    color: var(--red-color);
  }
`;

export { Nav };
