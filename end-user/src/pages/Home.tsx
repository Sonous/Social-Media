import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { motion, useAnimate } from "motion/react";

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

      <div className="relative w-full h-screen overflow-hidden bg-blue-900">
        {snowflakes.map((_, index) => {
          const randomX = Math.random() * 100; // Vị trí ngang ngẫu nhiên
          const randomSize = Math.random() * 20 + 5; // Kích thước ngẫu nhiên
          const randomDelay = Math.random() * 5; // Trễ ngẫu nhiên
          const randomDuration = Math.random() * 5 + 5; // Thời gian rơi ngẫu nhiên

          return (
            <motion.div
              key={index}
              initial={{
                y: -50, // Bắt đầu từ trên
                x: `${randomX}vw`, // Vị trí ngang ngẫu nhiên
                opacity: 0,
              }}
              animate={{
                y: "100vh", // Rơi xuống dưới
                opacity: [0.8, 1, 0.8], // Hiệu ứng sáng mờ
              }}
              transition={{
                duration: randomDuration, // Thời gian rơi
                repeat: Infinity, // Lặp vô hạn
                delay: randomDelay, // Trễ khởi động
              }}
              className="absolute bg-white rounded-full"
              style={{
                width: `${randomSize}px`,
                height: `${randomSize}px`,
              }}
            />
          );
        })}
      </div>

      <Button onClick={() => setShow(!show)}>Click me</Button>
    </div>
  );
}

export default Home;
