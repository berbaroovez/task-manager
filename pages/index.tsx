import styled from "styled-components";
import { useState, useEffect } from "react";
import { supabase } from "../util/initSupabase";
import { useAuth } from "../util/Auth";
import { LeaderBoard } from "../components/Leaderboard";
const Title = styled.h1`
  font-size: 50px;
`;

export default function Home() {
  const { signIn, user, signOut } = useAuth();

  return (
    <IndexDiv>
      <HeroDiv>
        <h2>Welcome to TaskManager</h2>
        <p>
          Its the twitch show were you get 3 challenges to compete in each week.
          The objective is to get the most points by making the Task Manager
          laugh
        </p>
      </HeroDiv>
      <LeaderBoardDiv>
        <h2>Leader Boards</h2>
        <LeaderBoard />
      </LeaderBoardDiv>
      <CallToActionDiv>
        <h2>Want to Play?</h2>
        <p>Click below to get signed up and start competing</p>
        <button onClick={signIn}>SignUp</button>
      </CallToActionDiv>
    </IndexDiv>
  );
}
const IndexDiv = styled.div`
  width: 100%;

  font-family: "Special Elite", cursive;
  text-align: center;
  p {
    font-size: 0.8em;
    @media (min-width: 768px) {
      font-size: 1.2em;
    }
  }
  h2 {
    text-align: center;
  }
`;

const HeroDiv = styled.div`
  margin: var(--section-margin);
  /* background-color: blue; */

  max-width: 800px;
  @media (min-width: 768px) {
    margin: 0 auto;
    margin-top: var(--section-margin);
    margin-bottom: 60px;
  }
`;
const LeaderBoardDiv = styled.div`
  width: 100%;
  margin-bottom: var(--section-padding);
  display: grid;
  justify-content: center;
  align-content: center;
`;
const CallToActionDiv = styled.div`
  /* margin: 0 var(--section-margin); */
  width: 100%;
  margin-bottom: var(--section-padding);
`;
