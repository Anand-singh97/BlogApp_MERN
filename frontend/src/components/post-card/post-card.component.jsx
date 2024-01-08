import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";
export const PostCard = (props) => {
  const {
    title,
    authorName,
    id,
    date,
    description,
    imagePosition,
    imageLocation,
  } = props;

  const isImageOnLeft = imagePosition === "left";
  return (
    <div
      className="flex flex-col items-center hover:scale-[1.02] transform transition-transform
      duration-300 ease-in-out md:flex-row mb-[2rem] gap-[0.5rem] 
      md:gap-[10rem] lg:gap-[10rem] mx-[3rem] w-fit"
    >
      <div
        className={`w-[17rem] md:w-[30rem] lg:w-[50rem]  ${
          isImageOnLeft ? "" : "md:order-2"
        }`}
      >
      <img
          src={imageLocation.url}
          alt="blog images"
          className="max-w-full max-h-full"/>
        
      </div>
      <div
        className={`text-center md:text-left ${
          isImageOnLeft ? "" : "md:order-1"
        }`}
      >
        <h2 className="font-semibold text-2xl md:text-3xl lg:text-4xl">
          {title}
        </h2>
        <div className="flex gap-5 justify-center md:justify-normal">
          <p className="font-semibold">{authorName}</p>
          <time>{formatISO9075(new Date(date))}</time>
        </div>

        <p className="">{description}</p>
        <div className="flex justify-center md:justify-normal">
          <div
            className="mt-[1.25rem] flex justify-center w-[45%] md:w-[30%] lg:w-[35%] bg-green-300 hover:bg-green-400 text-black
          font-semibold py-2 px-4"
          >
            <Link to={`/postDetails/${id}`}>
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
