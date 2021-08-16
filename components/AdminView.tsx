import {
  SubmissionType,
  EventInfoAndSubmissionType,
} from "../util/GlobalTypes";
import { FunctionComponent, ChangeEvent } from "react";
import { useEffect, useState, MouseEventHandler, MouseEvent } from "react";
import styled from "styled-components";
import { supabase } from "../util/initSupabase";
import { useAuth } from "../util/Auth";
// interface Username {
//   profiles: { username: string };
// }

// type ExtendedSubmission = SubmissionType & Username;

const AdminView: FunctionComponent<EventInfoAndSubmissionType> = ({
  eventInfo,
  submissions,
}) => {
  const { user } = useAuth();
  const [taskLabels, setTaskLabels] = useState<string[] | null>(null);
  const [showSubmission, setShowSubmission] = useState<number>(0);
  const [localCopyOfSubmissions, setLocalCopyOfSubmissions] = useState<
    SubmissionType[] | null
  >(null);
  useEffect(() => {
    setTaskLabels(eventInfo.tasks);
    setLocalCopyOfSubmissions(submissions);
  }, []);

  const handleShowSubmission = (index: number) => {
    setShowSubmission(index);
  };
  console.log("ADMIN", submissions);

  const updatePoints = async (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (localCopyOfSubmissions) {
      const tempSubmissions = [...localCopyOfSubmissions];
      if (parseInt(e.target.value)) {
        tempSubmissions[index].points[showSubmission] = parseInt(
          e.target.value
        );
      } else {
        tempSubmissions[index].points[showSubmission] = 0;
      }

      const { data, error } = await supabase
        .from("submissions")
        .update({ points: tempSubmissions[index].points })
        .match({
          submitted_by: tempSubmissions[index].submitted_by,
          id: tempSubmissions[index].id,
        });
      console.log("DATA", data);
      setLocalCopyOfSubmissions(tempSubmissions);
    }
  };

  //   if (user) {

  //   }
  return (
    <AdminContainer>
      <TaskPages>
        {taskLabels?.map((label, index) => (
          <button
            className={showSubmission === index ? "selected" : ""}
            key={label + index}
            data-idx={`index-${index}`}
            onClick={() => {
              handleShowSubmission(index);
            }}
          >
            {label}
          </button>
        ))}
      </TaskPages>
      <h1>{taskLabels && taskLabels[showSubmission]}</h1>
      {showSubmission != null &&
        localCopyOfSubmissions &&
        localCopyOfSubmissions.map((submission, index) => (
          <SubmissionsList key={submission.id}>
            <h1>{submission.profiles?.username}</h1>{" "}
            <input
              onChange={(e) => {
                updatePoints(e, index);
              }}
              data-idx={index}
              type="number"
              value={submission.points[showSubmission]}
            ></input>
          </SubmissionsList>
        ))}
    </AdminContainer>
  );
};

export default AdminView;

const TaskPages = styled.div`
  margin: 0 auto;
  width: 600px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;

  .selected {
    border: 2px solid #0004ff;
  }

  button {
    border-radius: 10px;
  }
`;

const SubmissionsList = styled.div`
  margin: 0 auto;
  width: 500px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  input {
    width: 70px;
    text-align: center;
  }
`;

const AdminContainer = styled.div`
  width: 800px;
  margin: 0 auto;
  display: grid;
  justify-content: center;
`;
