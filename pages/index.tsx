import styled from "styled-components";
import { useState, useEffect } from "react";
import { supabase } from "../util/initSupabase";
import { useAuth } from "../util/Auth";
import { LeaderBoard } from "../components/LeaderboardTable";
const Title = styled.h1`
  font-size: 50px;
`;

export default function Home() {
  const { signIn, user, signOut } = useAuth();

  return (
    <IndexDiv>
      <HeroDiv>
        <>
          <h1>Task Manager</h1>
          <p>The show with weird tasks.</p>
          <p> And even weirder submissions.</p>
          <CTAButton onClick={signIn}>Sign Up</CTAButton>
        </>
      </HeroDiv>
      <LeaderBoardDiv>
        <h2>Top Ten</h2>
        <LeaderBoard topTen />
      </LeaderBoardDiv>
      <CallToActionDiv>
        <h2>Want to Play?</h2>
        <p>Click Sign Up to get signed up and start competing</p>
        {/* <CTAButton onClick={signIn}>Sign Up</CTAButton> */}
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
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  background: linear-gradient(180deg, #d43e3e 0%, rgba(212, 62, 62, 0) 108.55%);
  width: 80%;
  max-width: 700px;
  margin: 0 auto;
  margin-bottom: 20px;
  border-radius: 10px;

  height: 200px;

  p:nth-child(3) {
    padding-bottom: 10px;
  }
  /*
  max-width: 800px;
  h1 {
    font-size: 5em;
    padding: 0;
    margin: 0;
  }
  p {
    font-size: 2.2em;
  } */
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

const CTAButton = styled.button`
  align-self: center;
  background: #d43e3e;
  border-radius: 10px;
  border: 0;
  padding: 10px 40px;
  font-size: 1em;
  color: #f7d1bf;
  &:hover {
    cursor: pointer;
  }
`;
