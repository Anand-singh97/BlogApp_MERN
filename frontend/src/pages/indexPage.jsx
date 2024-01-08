import { useEffect, useState } from "react";
import { PostCard } from "../components/post-card/post-card.component";
import { Audio } from "react-loader-spinner";

export const IndexPage = () => {
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    const getAllPosts = async () => {
      try {
        const response = await fetch("https://localhost:8000/posts/post", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const obj = await response.json();
          const { result } = obj;
          setAllPosts(result);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getAllPosts();
  }, []);

  if (allPosts.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Audio
          height="80"
          width="80"
          radius="9"
          color="green"
          ariaLabel="loading"
          wrapperStyle
          wrapperClass
        />
      </div>
    );
  }
  let isImageOnLeft = true;
  return (
    
    <div className="bg-gray-100 flex flex-col items-center py-5 mx-2 mt-2 rounded-lg gap-5">
      {allPosts.map(
        ({ author, title, summary, createdAt, imageLocation, _id }) => {
          isImageOnLeft = !isImageOnLeft;
          return (
            <PostCard
              key={_id}
              id={_id}
              imageLocation={imageLocation}
              title={title}
              authorName={author.username}
              date={createdAt}
              time={createdAt}
              imagePosition={isImageOnLeft ? "right" : "left"}
              description={summary}
            />
          );
        }
      )}
    </div>
  );
};
