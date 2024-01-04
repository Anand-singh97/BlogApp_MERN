import { useEffect, useState } from "react";
import { PostCard } from "../components/post-card/post-card.component";
import { Audio } from "react-loader-spinner";

export const IndexPage = () => {
  const [allPosts, setAllPosts] = useState([]);

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
  useEffect(() => {
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

      {/* <PostCard url = 'https://qph.cf2.quoracdn.net/main-qimg-1b8d58cf300feb80b2fa8d5f36db5497-lq' 
        title = 'Eren Jaeger - Attack on Titan' authorName = 'Mikasa' date = '2023-12-22' time = '6:49 PM' imagePosition='right' 
        description = 'As anyone who has spent time with cats knows, our feline companions are mysterious—much more so than those other furry family members'      
        />
        <PostCard url = 'https://www.arabianbusiness.com/cloud/2023/03/06/Cristiano-Ronaldo.jpg'
        title = 'CR7 the KING of football' authorName = 'CR-7' date = '2023-12-22' time = '6:49 PM' imagePosition='left' 
        description = 'As anyone who has spent time with cats knows, our feline companions are mysterious—much more so than those other furry family members'      
        />
        <PostCard url = 'https://thescriptlab.com/wp-content/uploads/2019/09/the-matrix-movies-neo-keanu-reeves-wallpaper-768x415.jpg'
        title = 'The Hero’s Journey Breakdown: The Matrix' authorName = 'Neo' date = '2023-12-22' time = '6:49 PM' imagePosition='right' 
        description = 'As anyone who has spent time with cats knows, our feline companions are mysterious—much more so than those other furry family members'      
        />
        <PostCard url = 'https://staticg.sportskeeda.com/editor/2023/11/9e4f2-16991024448309-1920.jpg?w=840'
        title = 'Sukuna the devil' authorName = 'Toji' date = '2023-12-22' time = '6:49 PM' imagePosition='left' 
        description = 'As anyone who has spent time with cats knows, our feline companions are mysterious—much more so than those other furry family members'      
        /> */}
    </div>
  );
};
