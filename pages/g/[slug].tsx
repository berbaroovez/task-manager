import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import Image from "next/image";
import {
  EventType,
  SubmissionType,
  EventInfoAndSubmissionType,
} from "../../util/GlobalTypes";
import { supabase } from "../../util/initSupabase";
import { useEffect, useState } from "react";
// import { PostgrestResponse, PostgrestError } from "@subabase/postgrest-js";
import { FunctionComponent } from "react";
import styled from "styled-components";

import AdminView from "./../../components/AdminView";

import { useAuth } from "../../util/Auth";

interface SlugProps {
  event: EventInfoAndSubmissionType;
}

interface Username {
  profiles: { username: string };
}

type ExtendedSubmission = SubmissionType & Username;
const Gallery: FunctionComponent<SlugProps> = ({ event }) => {
  const [submissions, setSubmissions] = useState<ExtendedSubmission[] | null>(
    null
  );
  const [isAdmin, setIsAdmin] = useState(false);
  const [filesLoaded, setFilesLoaded] = useState<boolean>(false);
  const [files, setFiles] = useState<string[] | null>(null);
  const [readyToRender, setReadyToRender] = useState<boolean>(false);
  const [showAdminView, setShowAdminView] = useState<boolean>(false);

  const { user } = useAuth();

  useEffect(() => {
    const checkIfAdmin = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("admin")
        .match({ id: user.id });

      if (data) {
        if (data[0].admin) {
          setIsAdmin(true);
        }
      }
    };

    if (user) {
      checkIfAdmin();
    }
  }, [user]);

  if (showAdminView) {
    return (
      <div>
        <AdminView
          eventInfo={event.eventInfo}
          submissions={event.submissions}
        />
      </div>
    );
  }

  return (
    <GalleryContainer>
      {isAdmin && (
        <button onClick={() => setShowAdminView(true)}>Points</button>
      )}

      <h1> {event.eventInfo.name}</h1>

      {event.submissions.map((subs) => {
        return (
          <GalleryDiv key={subs.id}>
            {subs.files?.map((file) => {
              if (file.type === "image") {
                if (file.url) {
                  return (
                    <img
                      src={file.url}
                      key={file.url}
                      style={{ width: "400px", height: "400px" }}
                    />
                  );
                }
              } else {
                if (file.url) {
                  return (
                    <video
                      src={file.url}
                      key={file.url}
                      controls
                      style={{ width: "400px", height: "200px" }}
                    />
                  );
                }
              }
            })}
          </GalleryDiv>
        );
      })}
    </GalleryContainer>
  );
};

export async function getStaticProps({ ...ctx }) {
  const getFiles = async (submissions: ExtendedSubmission[]) => {
    const tempSubmissions = submissions;
    console.log("Downloading files");
    if (tempSubmissions) {
      for (let j = 0; j < tempSubmissions.length; j++) {
        const files: any[] = [];

        for (let i = 0; i < tempSubmissions[j].file_paths.length; i++) {
          const temp = await getURLS(tempSubmissions[j].file_paths[i]);
          // console.log("This is the temp", temp!.url);
          files.push(temp);
        }

        tempSubmissions[j]["files"] = files;
      }
    }

    return tempSubmissions;
  };

  const getURLS = async (filePath: string) => {
    return new Promise(async (resolve, reject) => {
      if (filePath != "null") {
        // const { data } = await supabase.storage.from("files").download(filePath);

        const { signedURL, error } = await supabase.storage
          .from("files")
          .createSignedUrl(filePath, 15780000);

        // console.log("SIGNED URL", signedURL);
        if (error) {
          throw error;
        }

        let fileType;

        if (signedURL) {
          if (
            signedURL.includes("jpeg") ||
            signedURL.includes("jpg") ||
            signedURL.includes("png") ||
            signedURL.includes("gif") ||
            signedURL.includes("webp")
          ) {
            fileType = "image";
          } else if (
            signedURL.includes("mp4") ||
            signedURL.includes("webm") ||
            signedURL.includes("ogg") ||
            signedURL.includes("ogv") ||
            signedURL.includes("avi")
          ) {
            fileType = "video";
          } else {
            fileType = null;
          }

          resolve({ url: signedURL, type: fileType });
        }
      } else {
        resolve({ url: null, type: null });
      }
    });
  };

  const { slug } = ctx.params;
  console.log("Props slug", slug);
  //get event that matches slug
  const { data } = await supabase
    .from<EventType>("TaskEvents")
    .select()
    .eq("slug", slug);
  let eventInfo;

  if (data) {
    eventInfo = data[0];
    if (eventInfo) {
      const response = await supabase
        .from<ExtendedSubmission>("submissions")
        .select("*, profiles(username)")
        .eq("event_id", eventInfo.id);
      const submissions = response.data;

      if (submissions) {
        const completedSubmissions = await getFiles(submissions);
        const eventData: EventInfoAndSubmissionType = {
          eventInfo: eventInfo,
          submissions: completedSubmissions,
        };

        return {
          props: {
            event: eventData,
          },
        };
      }
    }
  }
  //get submissions that match event id

  //download the files for the submissions
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

const GalleryDiv = styled.div``;
const GalleryContainer = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  width: 1000px;

  justify-content: center;

  button {
    position: absolute;
    right: 0;
    top: 0;
  }
`;
