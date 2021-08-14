import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import { EventType, SubmissionType } from "../../util/GlobalTypes";
import { supabase } from "../../util/initSupabase";
import { useEffect, useState } from "react";
// import { PostgrestResponse, PostgrestError } from "@subabase/postgrest-js";
import { FunctionComponent } from "react";

interface SlugProps {
  event: EventType;
}

interface Username {
  profiles: { username: string };
}

type ExtendedSubmission = SubmissionType & Username;
const Gallery: FunctionComponent<SlugProps> = ({ event }) => {
  const [submissions, setSubmissions] = useState<ExtendedSubmission[] | null>(
    null
  );

  const [filesLoaded, setFilesLoaded] = useState<boolean>(false);
  const [files, setFiles] = useState<string[] | null>(null);
  const [readyToRender, setReadyToRender] = useState<boolean>(false);

  useEffect(() => {
    const getSubmissions = async () => {
      const response = await supabase
        .from<ExtendedSubmission>("submissions")
        .select("*, profiles(username)")
        .eq("event_id", event.id);

      console.log("Respoonse", response.data);
      setSubmissions(response.data);
    };

    getSubmissions();
  }, []);

  // this use effect waits until submissions have been loaded then goes through the file paths
  // it downloads the files and then saves the urls and also if the file is a image or video so we can dispaly it properly
  useEffect(() => {
    const getFiles = async () => {
      console.log("Downloading files");
      if (submissions) {
        submissions.forEach((submission, index) => {
          const files: any[] = [];
          submission.file_paths.forEach(async (file) => {
            if (file != "null") {
              const { data, error } = await supabase.storage
                .from("files")
                .download(file);
              if (error) {
                throw error;
              }

              let fileType;
              if (data?.type.includes("image")) {
                fileType = "image";
              } else if (data?.type.includes("video")) {
                fileType = "video";
              } else {
                fileType = null;
              }

              files.push({ url: URL.createObjectURL(data), type: fileType });
            } else {
              files.push({ url: null, type: null });
            }
          });
          const tempSubmission = { ...submission };
          tempSubmission["files"] = files;
          const tempSubbmissionArray = [...submissions];

          tempSubbmissionArray[index].files = files;
          console.log("Temp", tempSubbmissionArray);
          setSubmissions(tempSubbmissionArray);
        });
      }
    };
    if (submissions) {
      if (!filesLoaded) {
        setFilesLoaded(true);
        getFiles();
      }
    }

    console.log("Submissions updated", submissions);
  }, [submissions]);

  return (
    <div>
      <button
        onClick={() => {
          console.log(submissions);
        }}
      >
        {" "}
        Event{" "}
      </button>

      <button
        onClick={() => {
          setReadyToRender(true);
        }}
      >
        {" "}
        Render{" "}
      </button>
      <h1>Hello Ther </h1>
      {event.name}
      {readyToRender &&
        submissions?.map((submission) => (
          <div key={submission.id}>
            <h2>{submission.profiles.username}</h2>
            {submission.files?.map((file, index) => {
              if (file.type == "image") {
                return <img src={file.url} />;
              } else if (file.type == "video") {
                return <video controls src={file.url} />;
              } else {
                return null;
              }
              // else if
            })}
            {/* <p>{submission.description}</p> */}
          </div>
        ))}
    </div>
  );
};

export async function getStaticProps({ ...ctx }) {
  const { slug } = ctx.params;
  console.log("Props slug", slug);
  const { data } = await supabase.from("TaskEvents").select().eq("slug", slug);
  //   console.log("Props data", data);
  //   const event = {
  //     content: data,
  //   };

  return {
    props: {
      event: data![0],
    },
  };
}

export async function getStaticPaths() {
  const temp = await supabase.from<EventType>("TaskEvents").select();

  const paths = temp.data?.map((event) => {
    // console.log("Slug", event.slug);
    return {
      params: { slug: event.slug },
    };
  });
  console.log("Paths ", paths);

  return { paths, fallback: false };
}

export default Gallery;
