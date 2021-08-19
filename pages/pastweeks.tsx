// import {supabase
import { supabase } from "./../util/initSupabase";
import { EventType } from "../util/GlobalTypes";
import styled from "styled-components";
import Link from "next/link";
interface WeekProps {
  events: EventType[];
}
const Pastweeks = ({ events }: WeekProps) => {
  //   console.log("EVENTS", events);

  return (
    <PastWeeksContainer>
      <h1>Past Weeks</h1>

      {events.map((event, index) => (
        <EventDiv>
          <h3>{event.name}</h3>
          <ul>
            <li>
              <span>Task 1: </span>
              {event.tasks[0]}
            </li>
            <li>
              <span>Task 2: </span>
              {event.tasks[1]}
            </li>
            <li>
              <span>Task 3: </span>
              {event.tasks[2]}
            </li>
          </ul>
          <Link href="/g/week3">
            <a>
              <button>View</button>
            </a>
          </Link>
        </EventDiv>
      ))}
    </PastWeeksContainer>
  );
};

export async function getStaticProps() {
  const { data } = await supabase.from("TaskEvents").select("*");
  //   console.log(data);
  if (data) {
    return {
      props: {
        events: data,
      },
    };
  }
}

export default Pastweeks;
const EventDiv = styled.div`
  border-radius: 20px;
  background-color: #f5f5f5;
  width: 80%;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;

  ul {
    padding: 0;
    /* background-color: red; */
    text-decoration: none;
    list-style-type: none;

    span {
      font-weight: bold;
    }
  }

  button {
    font-family: var(--mystery-font);
    background: #d43e3e;
    border-radius: 10px;
    border: 0;
    padding: 5px 20px;
    font-size: 1.2em;
    color: #f7d1bf;
    &:hover {
      cursor: pointer;
    }
  }
`;

const PastWeeksContainer = styled.div`
  /* width: 800px;
  margin: 0 auto; */
  /* display: grid;
  justify-content: center; */

  h1 {
    text-align: center;
    font-family: var(--mystery-font);
  }
`;
