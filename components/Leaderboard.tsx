import styled from "styled-components";
const data = [
  { username: "Berbaroovez", points: 20 },
  { username: "Berbaroovez", points: 20 },
  { username: "Berbaroovez", points: 20 },
  { username: "Berbaroovez", points: 20 },
  { username: "Berbaroovez", points: 20 },
  { username: "Berbaroovez", points: 20 },
];
const LeaderBoard = () => {
  return (
    <LeaderBoardTable>
      {data.map(({ username, points }, index) => (
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
