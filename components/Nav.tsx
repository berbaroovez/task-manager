import styled from "styled-components";
import Link from "next/link";
import { useAuth } from "../util/Auth";

import { useEffect, useState } from "react";

interface NavProps {
  open: boolean;
}
const Nav = () => {
  const { user, signIn } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    /* Inside of a "useEffect" hook add an event listener that updates
       the "width" state variable when the window size changes */
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      }
    });

    /* passing an empty array as the dependencies of the effect will cause this
       effect to only run when the component mounts, and not each time it updates.
       We only want the listener to be added once */
  }, []);

  return (
    <OutterNavDiv>
      <NavDiv open={isOpen}>
        <NavLogo>
          <Link href="/">
            <a>TaskManager</a>
          </Link>
        </NavLogo>

        {/* {isOpen && ( */}
        <NavLinks open={isOpen}>
          {/* <ClickDiv
          onClick={() => {
            setIsOpen(false);
          }}
        > */}
          <Link href="/pastweeks">
            <a>Past Weeks</a>
          </Link>
          {/* </ClickDiv> */}
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

        <svg
          viewBox="0 0 100 80"
          width="40"
          height="40"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <rect width="80" height="15"></rect>
          <rect y="25" width="80" height="15"></rect>
          <rect y="50" width="80" height="15"></rect>
        </svg>
      </NavDiv>
    </OutterNavDiv>
  );
};

const NavDiv = styled.nav<NavProps>`
  svg {
    /* position: absolute; */
    fill: var(--creme-color);
    position: absolute;
    right: 5px;
    top: 5px;
    display: none;
    /* z-index: 20; */
  }

  height: 60px;
  background-color: var(--red-color);
  display: flex;
  justify-content: space-between;
  align-items: center;

  max-width: 900px;
  margin: 0 auto;

  @media (max-width: 770px) {
    width: 100vw;

    svg {
      display: flex;
    }
  }

  a,
  p {
    text-decoration: none;
    font-family: "Special Elite", cursive;
    color: var(--creme-color);
    cursor: pointer;
    /* line-height: 20px; */
    padding: 5px 10px;
    padding-bottom: 3px;
    border: 2px solid var(--creme-color);
    border-radius: 8px;
    margin-right: 8px;
  }
`;

const NavLinks = styled.ul<NavProps>`
  /* align-content: center; */

  list-style: none;
  display: flex;
  flex-flow: row nowrap;
  width: 90%;
  top: 0;
  justify-content: flex-end;
  align-items: center;

  a,
  p {
    &:hover {
      text-decoration: underline;
      background-color: var(--creme-color);
      color: var(--red-color);
    }
  }

  @media (max-width: 770px) {
    flex-flow: column nowrap;
    background-color: var(--red-color);
    position: fixed;
    top: -16px;
    right: 0;
    height: 100%;
    width: 180px;
    padding-top: 3.5rem;
    transition: transform 0.3s ease-in-out;
    justify-content: normal;
    transform: ${({ open }) => (open ? "translateX(0)" : "translateX(100%)")};

    a,
    p {
      margin-top: 2em;
    }
  }
`;

const NavLogo = styled.div`
  a {
    margin-left: 8px;
    font-size: 1.2em;
    background-color: var(--creme-color);
    color: var(--red-color);
    padding: 5px 10px;
  }
`;

const ClickDiv = styled.div``;

const OutterNavDiv = styled.div`
  height: 100%;
  background-color: var(--red-color);
`;
export { Nav };
