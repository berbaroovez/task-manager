import { useState, useRef, FormEvent, ChangeEvent } from "react";
import styled from "styled-components";
import { supabase } from "../../util/initSupabase";
import { useAuth } from "../../util/Auth";
import Router from "next/router";
const Week3 = () => {
  const [loading, setLoading] = useState(false);
  const file1Ref = useRef<HTMLInputElement>(null);
  const file2Ref = useRef<HTMLInputElement>(null);
  const file3Ref = useRef<HTMLInputElement>(null);

  const [file1, setFile1] = useState<string | null>(null);
  const [file2, setFile2] = useState<string | null>(null);
  const [file3, setFile3] = useState<string | null>(null);
  const { user } = useAuth();
  const handleSumbit = async (e: FormEvent) => {
    e.preventDefault();

    const hasSubmited = await supabase
      .from("profiles")
      .select("*")
      .match({ id: user.id });
    console.log(hasSubmited.error);

    if (hasSubmited.data) {
      if (hasSubmited.data.length > 0) {
        alert("You have already submitted your tasks!");
      } else {
        const filePathArray = [];
        setLoading(true);
        let file: File | undefined = undefined;
        for (let i = 1; i <= 3; i++) {
          const user = supabase.auth.user();
          if (eval(`file${i}Ref`).current) {
            if (eval(`file${i}Ref`).current.files) {
              file = eval(`file${i}Ref`)!.current!.files![0];
            }
          }

          if (file) {
            const fileExt = file.name.split(".").pop();
            const fileName = `${user?.id}${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;
            // const file = file1Ref!.current!.files![0];
            const { data, error } = await supabase.storage
              .from("files")
              .upload(filePath, file);
            console.log(`data ${i}`, data);
            console.log("Error,", error);

            if (!error && data) {
              filePathArray.push(filePath);
            }
          } else {
            filePathArray.push("null");
          }
        }

        const { data, error } = await supabase
          .from("submissions")
          .insert([
            { file_paths: filePathArray, submitted_by: user.id, event_id: 1 },
          ]);

        console.log(`data `, data);
        console.log("Error,", error);
        setLoading(false);
        Router.push("/dashboard");
      }
    }
  };

  const onPhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target.name === "file-1") {
        setFile1(URL.createObjectURL(e.target.files[0]));
      } else if (e.target.name === "file-2") {
        setFile2(URL.createObjectURL(e.target.files[0]));
      } else {
        setFile3(URL.createObjectURL(e.target.files[0]));
      }
    }
  };
  return (
    <FormContainer>
      {/* <h1>{user.id}</h1>
      <button onClick={testfunction}>Submit</button> */}
      <h1>Week 3 Tasks </h1>
      <form onSubmit={handleSumbit}>
        <TaskDiv>
          <label htmlFor="file-1">
            Create the most super image of the Task Manager. Most super wins.
          </label>
          <input
            type="file"
            name="file-1"
            id="file-1"
            accept="image/png, image/jpeg"
            ref={file1Ref}
            onChange={onPhotoChange}
          />
          {file1 && <img src={file1} />}
        </TaskDiv>

        <TaskDiv>
          <label htmlFor="file-2">
            Make the Task Manager laugh. Biggest laugh wins
          </label>
          <input
            type="file"
            name="file-2"
            id="file-2"
            accept="image/* video/*"
            ref={file2Ref}
            onChange={onPhotoChange}
          />
          {file2 && <img src={file2} />}
        </TaskDiv>
        <TaskDiv>
          <label htmlFor="file-3">
            Flip a bottle. Smallest landing zone wins.
          </label>
          <input
            type="file"
            name="file-3"
            id="file-3"
            accept="image/* video/*"
            ref={file3Ref}
            onChange={onPhotoChange}
          />
          {file3 && <img src={file3} />}
        </TaskDiv>
        <WarningText>
          You can only submit once so make sure you are submitting everything
          you want. If you have messed up contact <span>Berbaroovez#0001</span>{" "}
          on discord{" "}
        </WarningText>
        <button type="submit">{loading ? "Submitting...." : "Submit"}</button>
      </form>
    </FormContainer>
  );
};

const TaskDiv = styled.div`
  width: 80%;
  max-width: 500px;
  margin: 0 auto;
  margin-bottom: var(--large-margin);

  input[type="button"],
  input[type="submit"],
  input[type="reset"] {
    background-color: #4caf50;
    border: none;
    color: white;
    padding: 16px 32px;
    text-decoration: none;
    margin: 4px 2px;
    cursor: pointer;
  }

  :first-of-type {
    margin-top: var(--large-margin);
  }
`;
const FormContainer = styled.div`
  width: 100%;
  display: grid;
  justify-content: center;
  text-align: center;
`;

const WarningText = styled.p`
  color: red;
  width: 80%;
  max-width: 500px;
  margin: 0 auto;
  font-size: 0.8em;
`;

export default Week3;
