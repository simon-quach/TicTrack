import TrackeeCard from "@/app/(protected)/_components/TrackeeCard";

export default function Home() {
  return (
    <main className="px-6 py-16">
      <div className="font-bold text-[#FF5C5C]">WEEK 1</div>
      <div className="font-bold text-[24px]">Active Trackies</div>
      <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3">
        <TrackeeCard />
        <TrackeeCard />
        <TrackeeCard />
        <TrackeeCard />
        <TrackeeCard />
        <TrackeeCard />
      </div>

      <div className="fixed bottom-4 left-[50%] translate-x-[-50%] bg-[#FF5C5C] text-white w-[calc(100vw-64px)] text-center font-medium rounded-[8px] py-2 shadow-lg hover:bg-[#e95c5c] hover:cursor-pointer">
        Check in
      </div>
    </main>
  );
}
