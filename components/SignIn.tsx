import styled from "styled-components";
import { useAuth } from "../util/Auth";

export default function YourNotSignedIn() {
  const { signIn } = useAuth();
  return (
    <SignInContainer>
      You are not signed in please sign in{" "}
      <a onClick={signIn}>
        <Here>here</Here>
      </a>
    </SignInContainer>
  );
}

const Here = styled.span`
  color: red;
  :hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const SignInContainer = styled.div`
  text-align: center;
  font-size: 1.5em;
  width: 300px;
  margin: 50px auto;
`;
