import { EventTypeTest } from "../../util/GlobalTypes";
import Router from "next/router";
import SignIn from "../../components/SignIn";
import { supabase } from "../../util/initSupabase";
import { useAuth } from "../../util/Auth";
import { useEffect, useState, useRef, FormEvent } from "react";
// import { PostgrestResponse, PostgrestError } from "@subabase/postgrest-js";
import { FunctionComponent } from "react";
import styled from "styled-components";

type AnswerType = {
  type: "file" | "text" | null;
  data: string | null;
};

const EventSubmit: FunctionComponent<EventTypeTest> = (props) => {
  const itemsRef = useRef<Array<any>>([]);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  console.log("EventSubmit props", props);

  useEffect(() => {
    console.log("EventSubmit useEffect", typeof props.tasks);
    itemsRef.current = itemsRef.current.slice(
      0,
      Object.keys(props.tasks).length
    );
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const hasSubmited = await supabase
      .from("testsubmissions")
      .select("*")
      .match({ event_id: props.id, submitted_by: user.id });

    console.log("EventSubmit handleSubmit", hasSubmited.data);
    if (hasSubmited.error) {
      console.error(hasSubmited.error);
    }

    setLoading(true);
    if (hasSubmited.data) {
      if (hasSubmited.data.length > 0) {
        alert(
          "You have already submitted your tasks! \n We will see you next week!"
        );
      } else {
        const filePathArray = [];
        let file: File | undefined = undefined;

        for (let i = 0; i < itemsRef.current.length; i++) {
          let tempAnswerObject: AnswerType = {
            type: null,
            data: null,
          };
          file = undefined;

          if (itemsRef.current) {
            if (itemsRef.current[i].files) {
              file = itemsRef.current[i].files[0];
            }
          }

          // 1. if its a file field then upload the file annd save the file path
          // 2. if its a text field then save the text
          // 3. if is an empty field then leave everything as null
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
              tempAnswerObject.data = filePath;
              tempAnswerObject.type = "file";
              filePathArray.push(tempAnswerObject);
            }
          } else if (itemsRef.current[i].value) {
            tempAnswerObject.type = "text";
            tempAnswerObject.data = itemsRef.current[i].value;
            filePathArray.push(tempAnswerObject);
          } else {
            filePathArray.push(tempAnswerObject);
          }
        }

        const { data, error } = await supabase.from("testsubmissions").insert([
          {
            anwsers: {
              ...filePathArray,
            },
            submitted_by: user.id,
            event_id: props.id,
          },
        ]);

        console.log(`data `, data);
        console.log("Error,", error);
        setLoading(false);
        Router.push("/dashboard");
      }
    }

    // console.log("filePathArray", filePathArray);
  };

  if (!user) {
    return <SignIn />;
  }

  return (
    <SubmitContainer onSubmit={handleSubmit}>
      <h1>{props.name}</h1>

      {Object.keys(props.tasks).map((keyName, i) => {
        if (props.tasks[keyName].type === "text") {
          return (
            <>
              {" "}
              <p key={i}> {props.tasks[keyName].label}</p>
              <input type="text" ref={(el) => (itemsRef.current[i] = el)} />
            </>
          );
        } else {
          return (
            <>
              {" "}
              <p key={i}> {props.tasks[keyName].label}</p>
              <input type="file" ref={(el) => (itemsRef.current[i] = el)} />
            </>
          );
        }
      })}
      <input type="submit" onClick={handleSubmit} value="submit" />
    </SubmitContainer>
  );
};

export async function getStaticProps({ ...ctx }) {
  const { data, error } = await supabase
    .from<EventTypeTest>("testtable2")
    .select("*")
    .eq("slug", ctx.params.slug);

  return {
    props: data![0],
  };
}

export async function getStaticPaths() {
  const temp = await supabase.from<EventTypeTest>("testtable2").select();

  const paths = temp.data?.map((event) => {
    // console.log("Slug", event.slug);
    return {
      params: { slug: event.slug },
    };
  });
  //   console.log("Paths ", paths);

  return { paths, fallback: false };
}

export default EventSubmit;

const SubmitContainer = styled.form`
  width: 300px;
  margin: 0 auto;
  /* text-align: center; */

  p {
    font-size: 1.2em;
    font-weight: bold;
  }

  input {
    margin-bottom: 20px;
  }

  input[type="submit"] {
    font-family: var(--mystery-font);
    background-color: var(--creme-color);
    border: 2px var(--creme-color) solid;
    border-radius: 10px;

    padding: 5px 20px;
    font-weight: bold;
    color: var(--red-color);
    &:hover {
      cursor: pointer;
    }

    /* align-self: center; */
    width: 120px;
    margin: 0 auto;
  }
`;
