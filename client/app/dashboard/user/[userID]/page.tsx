"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import ShowProfileInfo from"@/components/user/showingUser/showProfileInfo"
import ShowContactInfo from "@/components/user/showingUser/showContactInfo";
import ShowCompanyInfo from "@/components/user/showingUser/showCompanyInfo";
import OrderListHistory from "@/components/user/showingUser/orderListHistory";

function ShowUser() {
  const { userID } = useParams();

  const [user, setUser] = useState({
    _id:"",
    name:"",
    userName:"",
    Brithday:"",
    password:"",
  });
  useEffect(() => {
    let ignore = false;
    fetch(`/api/profile/getProfileInfo/${userID}`)
      .then((res) => {
        return res.json();
      })
      .then((jsonData) => {
        if (!ignore) {
          console.log(jsonData, "User in SHowing");

          setUser(jsonData.data);
        }
      })
      .catch((err: unknown) => {
        console.log(err);
      })
      .finally(() => {
        if (!ignore) {
          console.log("noLoding");
        }
      });
    return () => {
      ignore = true;
    };
  }, [userID]);

  return (
    <div className="bg-gradient heighWithOutBar w-full overflow-auto pt-2">

      <div className="grid md:grid-cols-2 gap-6 lg:gap-12   relative mx-auto pb-6 pt-2 container">
        <div>
        <Card className="rounded-lg shadow-lg card-gradient h-fit" >
      <Image
        src="/noPhoto.jpg"
        alt="Product Image"
        width={500}
        height={500}
        className="aspect-square object-cover w-full rounded-lg "
      />
      </Card>
      <ShowCompanyInfo/>
      </div>
      <div>
     {user!== undefined && <ShowProfileInfo data={user}/>}
     <ShowContactInfo/>
     <OrderListHistory/>
      </div>
      </div>
    </div>
  );
}

export default ShowUser;
