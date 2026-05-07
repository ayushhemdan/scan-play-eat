import { getAllSlugs } from "@/lib/cafes";
import MenuManager from "@/components/admin/MenuManager";

export const metadata = { title: "Admin — ScanPlayEat" };

export default function AdminPage() {
  const slugs = getAllSlugs();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <span className="font-black text-lg">
          Scan<span className="text-amber-400">Play</span>Eat
          <span className="text-zinc-600 font-normal text-sm ml-2">/ Admin</span>
        </span>
        <span className="text-xs text-zinc-600 bg-white/4 border border-white/8 px-3 py-1 rounded-full">
          Internal tool — keep this URL private
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <MenuManager cafeSlugs={slugs} />
      </div>
    </div>
  );
}
