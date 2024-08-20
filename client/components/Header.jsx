"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import SERVER_URL from "../config/serverUrl";
import axios from "axios";
import { useRouter } from "next/navigation";

function Header() {
  const [name, setName] = useState(null);
  const [admin, setAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    axios
      .get(SERVER_URL + "/validate-token", { withCredentials: true })
      .then(({ data }) => {
        setName(data.claims.username);
        setAdmin(data.claims.admin);
      });
  }, []);

  return (
    <div className=" fixed top-5 left-0 flex justify-center items-center w-full">
      <div className="text-[rgb(152,211,255)] backdrop-blur-sm rounded-full flex justify-between w-[90%] h-11 border border-[#259ac4]">
        <div className="rounded-full flex justify-center items-center cursor-pointer border-r border-[#259ac4] w-11 h-full">
          <Link href={"/"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="currentColor"
              class=" bi bi-book-half"
              viewBox="0 0 16 16"
            >
              <path d="M8.5 2.687c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783" />
            </svg>
          </Link>
        </div>
        <div className="flex gap-2 text-[rgb(152,211,255)] cursor-pointer duration-300 hover:bg-[#335f805f]  items-center p-3 px-4  rounded-full border-x border-[#259ac4]">
          <h1>Exams </h1>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-chevron-down"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
            />
          </svg>
        </div>

        {admin && (
          <Link
            href="/admin"
            className="flex cursor-pointer duration-300 hover:bg-[#335f805f]  items-center p-3 px-4  rounded-full border-x border-[#259ac4]"
          >
            <h1>Admin</h1>
          </Link>
        )}

        <div className="flex rounded-full border-x border-[#259ac4]">
          {name ? null : (
            <Link
              href={"/signup"}
              className="px-4 p-3 text-full duration-300 hover:bg-[#335f805f] flex items-center rounded-full "
            >
              Signup
            </Link>
          )}
          {name ? null : (
            <Link
              href={"/login"}
              className="px-4 p-3 text-full duration-300 hover:bg-[#335f805f] flex items-center rounded-full "
            >
              Login
            </Link>
          )}
          {name && (
            <Link
              href={"/login"}
              className="px-4 p-3 text-full duration-300 hover:bg-[#335f805f] flex items-center rounded-full "
            >
              {name}
            </Link>
          )}
        </div>
        <div className="rounded-full flex justify-center items-center cursor-pointer  border-l border-[#259ac4] w-11 h-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            class=" font-thin bi bi-brightness-high"
            viewBox="0 0 16 16"
          >
            <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708" />
          </svg>
        </div>
      </div>
    </div>
  );
}
export default Header;
