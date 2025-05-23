import Link from "next/link";
import React from "react";
import Reviews from "../components/reviews";
import validateJwt from "@/lib/validateJwt";
import { getUserById } from "@/lib/db/user";
import { redirect } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/navbar";
import { getUserLastReviews } from "@/lib/db/purchase";

async function Page() {
  const token = await validateJwt();
  if (!token) redirect("/login");
  const user = await getUserById(token.id);
  if (!user) redirect("/login");

  const lastReviews = await getUserLastReviews(user.id.toString());

  return (
    <>
      <Navbar page="perfil" />
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between flex-col gap-12">
        <header className="w-full bg-[#171D25] p-6 mt-4 rounded-md shadow-2xl flex items-start justify-between">
          <div className="flex items-start gap-6 h-full">
            {/** Imagem */}
            <div className="flex items-center justify-center h-36 w-36 bg-[#282f39]  rounded-sm">
              <Image
                src={user.isAdmin ? "/admin-pp.png" : "/user-pp.png"}
                height={112}
                width={112}
                alt={user.isAdmin ? "Admin Picture" : "User Picture"}
                className="h-28 w-28"
              />
            </div>

            {/** Informacoes */}
            <div className="flex flex-col items-start max-w-[300px] justify-between h-36 gap-2">
              <div>
                <p className="text-xl">{user.username}</p>
                <p className="text-[#c4c4c4] text-xs max-w-[300px]">
                  {user.email}
                </p>
              </div>
              <p className="text-[#c4c4c4] text-sm max-w-[300px]">
                {user.description}
              </p>
            </div>
          </div>

          <div className="flex items-end flex-col justify-between h-36">
            <div className="text-sm bg-emerald-800 font-semibold px-3 py-1 rounded-sm text-emerald-200">
              R$ {user.balance.toFixed(2)}
            </div>

            <div className="flex items-end flex-col gap-2">
              <Link
                className="from-[#2A475E] to-[#223143] bg-gradient-to-b text-sm px-4 py-1.5 rounded-sm cursor-pointer opacity-100 hover:opacity-85 transition-all delay-75"
                href={"/editprofile"}
              >
                Editar perfil
              </Link>
            </div>
          </div>
        </header>

        {/** Lista de jogos */}
        {/** Deve ter botao de refund */}
        <div className="grid grid-cols-3 gap-2 w-full">
          {lastReviews.map(({ _id, game, review, stars }) => (
            <Reviews
              id={_id.toString()}
              name={game.name}
              photoUrl={game.photoUrl}
              review={review}
              stars={stars}
              slug={game.slug}
              key={_id}
            />
          ))}
        </div>

        <div
          dangerouslySetInnerHTML={{
            __html: `<!-- Teste logs --> \n <script> console.log(\`${user.description}\`) </script>`,
          }}
        />
      </div>
    </>
  );
}

export default Page;
