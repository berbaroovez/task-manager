import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import { EventType } from "../../util/GlobalTypes";
import { supabase } from "../../util/initSupabase";

import { FunctionComponent } from "react";

interface SlugProps {
  event: EventType;
}
const Gallery: FunctionComponent<SlugProps> = ({ event }) => {
  console.log("EVENT", event);

  return (
    <div>
      <button
        onClick={() => {
          console.log(event);
        }}
      >
        {" "}
        Event{" "}
      </button>
      <h1>Hello Ther </h1>
      {event.name}
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
