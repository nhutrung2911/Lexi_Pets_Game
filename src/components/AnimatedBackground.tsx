export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#7dd3fc]">
      {/* 1. Sky */}
      <img src="/sky.png" className="absolute inset-0 w-full h-full object-cover" alt="" />
      
      {/* 2. Mây (Bay chậm) */}
      <div className="absolute top-10 left-0 w-full h-64 animate-[moveCloud_40s_linear_infinite]">
        <img src="/clouds.png" className="absolute top-4 left-10 w-96 h-auto opacity-80" alt="" />
        <img src="/clouds.png" className="absolute top-20 left-1/2 w-72 h-auto opacity-60 scale-x-[-1]" alt="" />
      </div>
      
      {/* 3. Núi (Chân trời) */}
      <img src="/mountains.png" className="absolute bottom-[40vh] w-full h-auto object-cover opacity-90" alt="" />
      
      {/* 4. Rừng cây xa (Sway chậm) */}
      <img src="/trees_back2.png" className="absolute bottom-[35vh] left-0 h-[40vh] w-auto animate-[sway_6s_ease-in-out_infinite_alternate]" alt="" style={{ transformOrigin: 'bottom center' }} />
      <img src="/trees_back.png" className="absolute bottom-[35vh] right-0 h-[45vh] w-auto animate-[sway_5s_ease-in-out_infinite_alternate]" alt="" style={{ transformOrigin: 'bottom center' }} />
      
      {/* 5. Dòng sông & Mặt đất */}
      <img src="/ground.png" className="absolute bottom-0 w-full h-[50vh] object-cover" alt="" />
      <img src="/river.png" className="absolute bottom-[20vh] w-full h-[15vh] object-cover opacity-80" alt="" />
      
      {/* 6. Kiến trúc */}
      <img src="/castle.png" className="absolute bottom-[40vh] right-[10%] w-64 h-auto opacity-90" alt="" />
      <img src="/house.png" className="absolute bottom-[30vh] left-[15%] w-56 h-auto" alt="" />
      <img src="/bridge.png" className="absolute bottom-[22vh] left-1/2 -translate-x-1/2 w-72 h-auto" alt="" />
      
      {/* 7. Hàng cây gần (Sway vừa phải) */}
      <img src="/trees_front.png" className="absolute bottom-0 left-[-5%] h-[60vh] w-auto animate-[sway_4s_ease-in-out_infinite_alternate]" alt="" style={{ transformOrigin: 'bottom center' }} />
      
      {/* 8. Các vật thể trên cỏ */}
      <img src="/home_sign.png" className="absolute bottom-[15vh] right-[20%] w-32 h-auto" alt="" />
      <img src="/platform.png" className="absolute bottom-[10vh] left-1/2 -translate-x-1/2 w-80 h-auto" alt="" />
      <img src="/shadow.png" className="absolute bottom-[8vh] left-1/2 -translate-x-1/2 w-64 h-auto opacity-50 animate-[breathe_3s_ease-in-out_infinite_alternate]" alt="" />
      
      {/* 9. Cỏ tiền cảnh (Sway nhanh) */}
      <img src="/grass_front.png" className="absolute bottom-0 w-full h-[25vh] object-cover animate-[sway_2.5s_ease-in-out_infinite_alternate]" alt="" style={{ transformOrigin: 'bottom center' }} />
    </div>
  );
}
