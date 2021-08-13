import DashboardSkeleton from "../../components/Dashboard/DashboardSkeleton";
import { useAuth } from "../../util/Auth";
import Router from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { supabase } from "../../util/initSupabase";
import { EventType } from "../../util/GlobalTypes";
export default function Dashboard() {
  const { user, signIn, signOut } = useAuth();
  const [events, setEvents] = useState<EventType[] | null>(null);
  useEffect(() => {
    if (user) {
      getEvents();
    }
  }, [user]);

  const getEvents = async () => {
    const temp = await supabase.from<EventType>("TaskEvents").select();
    setEvents(temp.data);
    console.log(temp.data);
  };

  if (!user)
    return (
      <div>
        You are not signed in please sign in{" "}
        <a onClick={signIn}>
          <Here>here</Here>
        </a>
      </div>
    );

  return (
    <div>
      <DashboardDiv>
        <h2>Welcome to TaskManager</h2>
        <h3>{user.user_metadata.full_name}, your tasks are below </h3>
        <p>The Dashboard is currently under construction</p>
        <Iconp>🚧</Iconp>

        {events
          ? events.map((event) => (
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
                <Link href="/e/week3">
                  <a>
                    <button>Join</button>
                  </a>
                </Link>
              </EventDiv>
            ))
          : null}
      </DashboardDiv>
    </div>
  );
}

const DashboardDiv = styled.div`
  width: 800px;
  margin: 0 auto;
  display: grid;
  justify-content: center;
`;

const EventDiv = styled.div`
  border-radius: 20px;
  background-color: #f5f5f5;
  width: 400px;
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
`;
const Iconp = styled.p`
  text-align: center;
  font-size: 30px;
`;

const Here = styled.span`
  color: red;
`;
