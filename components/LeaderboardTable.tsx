import styled from "styled-components";
import { supabase } from "../util/initSupabase";

import { useEffect, useState } from "react";
// import {
// import { useState } from 'react';
const data = [
  { username: "Berbaroovez", points: 20 },
  { username: "Berbaroovez", points: 20 },
  { username: "Berbaroovez", points: 20 },
  { username: "Berbaroovez", points: 20 },
  { username: "Berbaroovez", points: 20 },
  { username: "Berbaroovez", points: 20 },
];

type LeaderBoardType = {
  username: string;
  points: number;
};

type LeaderBoardProps = {
  topTen?: boolean;
};
const LeaderBoard = ({ topTen }: LeaderBoardProps) => {
  var tempArray: LeaderBoardType[] = [];
  const [leaderboard, setLeaderboard] = useState<null | any[]>(null);
  useEffect(() => {
    const getAllPoints = async () => {
      const { data } = await supabase
        .from("submissions")
        .select("points, profiles(username)");

      data?.forEach(({ points, profiles }) => {
        // console.log(points.reduce((a: number, b: number) => a + b, 0));
        let tempObject: LeaderBoardType = {
          username: profiles.username,
          points: points.reduce((a: number, b: number) => a + b, 0),
        };

        tempArray.push(tempObject);
      });
      // console.log(data)
      tempArray.sort((a, b) => (a.points < b.points ? 1 : -1));

      if (topTen) {
        tempArray = tempArray.slice(0, 10);
      }
      setLeaderboard(tempArray);
    };

    getAllPoints();
  }, []);
  return (
    <LeaderBoardTable>
      {leaderboard?.map(({ points, username }, index) => (
        <>
          <UserName>{username}</UserName>
          <Points>{points}</Points>
        </>
      ))}
    </LeaderBoardTable>
  );
};
const LeaderBoardTable = styled.div`
  /* background-color: blue; */
  width: 300px;
  display: grid;
  /* align-content: center;
  justify-content: center; */
  grid-template-columns: 1fr 1fr;
`;
const UserName = styled.div`
  text-align: right;
`;

const Points = styled.div``;

export { LeaderBoard };
