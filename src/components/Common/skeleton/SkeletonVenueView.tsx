export function SkeletonVenueView() {
  const block = 'bg-gray-200';
  const line = 'bg-gray-200';
  const rule = 'bg-gray-200';

  return (
    <section
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="mx-auto w-full max-w-[85%] px-4 py-8 md:py-10"
    >
      <div
        className={`overflow-hidden rounded-2xl shadow animate-pulse ${block}`}
      >
        <div className={`aspect-[16/7] w-full ${block}`} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <div className="space-y-3">
            <div className={`h-7 w-2/3 rounded ${line} animate-pulse`} />
            <div className="flex items-center gap-4">
              <div className={`h-4 w-28 rounded ${line} animate-pulse`} />
              <div className={`h-4 w-20 rounded ${line} animate-pulse`} />
              <div className={`h-4 w-16 rounded ${line} animate-pulse`} />
              <div className={`h-4 w-14 rounded ${line} animate-pulse`} />
            </div>
          </div>

          <div className={`h-[1px] w-full ${rule}`} />

          <div className="space-y-3">
            <div className={`h-5 w-40 rounded ${line} animate-pulse`} />
            <div className={`h-4 w-full rounded ${line} animate-pulse`} />
            <div className={`h-4 w-[92%] rounded ${line} animate-pulse`} />
            <div className={`h-4 w-[85%] rounded ${line} animate-pulse`} />
            <div className={`h-4 w-[70%] rounded ${line} animate-pulse`} />
          </div>

          <div className={`h-[1px] w-full ${rule}`} />

          <div className="space-y-3">
            <div className={`h-5 w-28 rounded ${line} animate-pulse`} />
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: 8 }).map((_, index) => (
                <span
                  key={index}
                  className={`inline-block h-7 w-20 rounded-full ${block} animate-pulse`}
                />
              ))}
            </div>
          </div>
        </div>

        <aside className="md:col-span-1">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow">
            <div className={`mb-4 h-6 w-32 rounded ${line} animate-pulse`} />
            <div className={`mb-2 h-4 w-24 rounded ${line} animate-pulse`} />

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className={`h-10 rounded-lg ${block} animate-pulse`} />
              <div className={`h-10 rounded-lg ${block} animate-pulse`} />
            </div>

            <div className={`mt-4 h-10 rounded-lg ${block} animate-pulse`} />

            <div className={`mt-5 h-11 rounded-lg ${block} animate-pulse`} />
          </div>
        </aside>
      </div>
    </section>
  );
}
