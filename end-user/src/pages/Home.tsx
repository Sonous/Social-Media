import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { motion, useAnimate } from "motion/react";
// import { Loading } from "@/components/Loading";

function Home() {
  const [show, setShow] = useState(false);
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const snowflakes = Array.from({ length: 200 }); // Tạo 50 bông tuyết

  useEffect(() => {
    if (show) {
      animate(
        scope.current,
        { opacity: 1, transform: "translateY(-50px)" },
        { duration: 0.5 }
      );
    } else {
      animate(
        scope.current,
        { opacity: 0, transform: "translateY(0px)" },
        { duration: 0.5 }
      );
    }
  }, [show]);

  return (
    <div className="p-10 bg-black w-flex col-span-11">
      <h1>Home</h1>
      <div ref={scope} className="w-10 h-10 bg-red-500 opacity-0" />

      <Button onClick={() => setShow(!show)}>Click me</Button>
      {/* <Loading state="full" size={30}/> */}
    </div>
  );
}

export default Home;
