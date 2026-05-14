{/* Sidebar Column */}
<div className="bg-white sticky top-24 rounded-xl shadow-sm border border-gray-100 p-8 min-h-112.5">
  {selectedMapState ? (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-serif font-bold text-gray-800 flex items-center gap-2">📊 Impact Snapshot</h3>
        <button onClick={() => setSelectedMapState(null)} className="text-gray-400 hover:text-red-500 text-3xl font-light">&times;</button>
      </div>

      {/* 1. Static State Image */}
      <div className="mb-8 rounded-xl overflow-hidden h-48 shadow-md border border-gray-100">
        <img src={selectedMapState.staticImage} alt={selectedMapState.name} className="w-full h-full object-cover" />
      </div>

      {/* 2. List-style Impact Metrics */}
      <ul className="space-y-8">
        <li className="pb-2 border-b border-gray-50">
          <h4 className="text-2xl font-serif font-bold text-gray-900">📍 {selectedMapState.name}</h4>
        </li>
        <li className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-[#576123]/10 text-[#576123] flex items-center justify-center text-xl font-black">
            {selectedMapState.districtCount}
          </div>
          <div>
            <div className="text-sm font-bold text-gray-800 uppercase tracking-tight">Districts Operated</div>
            <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Local Intervention</div>
          </div>
        </li>
        <li className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-xl font-black">
            {selectedMapState.projects.length}
          </div>
          <div>
            <div className="text-sm font-bold text-gray-800 uppercase tracking-tight">Major Projects</div>
            <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Active Currently</div>
          </div>
        </li>
        <li className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-xl font-black">
            {selectedMapState.livesImpacted}
          </div>
          <div>
            <div className="text-sm font-bold text-gray-800 uppercase tracking-tight">Lives Impacted</div>
            <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Total Beneficiaries</div>
          </div>
        </li>
      </ul>
    </div>
  ) : (
    /* National Impact View (Default) */
    <div>
      <h3 className="text-xl font-serif font-bold text-gray-800 mb-8">📊 National Impact</h3>
      {/* Same <ul> list as above with national totals */}
    </div>
  )}
</div>