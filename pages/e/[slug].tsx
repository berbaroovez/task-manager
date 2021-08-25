import {
  EventTypeTest,
  SubmissionType,
  EventInfoAndSubmissionType,
} from "../../util/GlobalTypes";
import Router from "next/router";
import { supabase } from "../../util/initSupabase";
import { useAuth } from "../../util/Auth";
import { useEffect, useState, useRef } from "react";
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

  const handleSubmit = async () => {
    setLoading(true);
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
      } else {
        tempAnswerObject.type = "text";
        tempAnswerObject.data = itemsRef.current[i].value;
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
    // console.log("filePathArray", filePathArray);
  };

  return (
    <div>
      Hello World
      <p>{Object.keys(props.tasks).length}</p>
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
      <button onClick={handleSubmit}>Submit</button>
    </div>
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
