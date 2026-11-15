import RoomCanvas from "@/components/room/RoomCanvas";

export default function Home() {
  return (
    <main className="relative h-dvh w-full overflow-hidden bg-[#0c0e17]">
      <RoomCanvas />
      <div className="pointer-events-none absolute left-6 top-6 text-[#f2ead9]">
        <p className="text-sm font-semibold tracking-wide">Abdul Samad Sohail</p>
        <p className="mt-1 text-xs opacity-60">3D room preview: click Abdul to make him wave, pull the lamp cord for day mode.</p>
      </div>
    </main>
  );
}
