import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="my-10">
      <h1 className="text-xl text-gray-800 text-center font-medium">
        Page not found.{" "}
        <Link
          to="/login"
          className="text-orange-600 font-semibold underline ml-2"
        >
          Go to login page.
        </Link>
      </h1>
    </div>
  );
}
