import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { type FormEvent } from "react";
import { useRouter } from "next/router";

const UserProfile: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  console.log(router.pathname);

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div>
      <h1 className="mb-16">User Page for: {session?.user.name}</h1>
      <form onSubmit={(e) => handleFormSubmit(e)}>
        <input type="text" />
      </form>
    </div>
  );
};

export default UserProfile;
