export default function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200 py-10 text-center mt-auto">
      <div className="container mx-auto px-4">
        <p className="text-xs text-neutral-500 mb-2 max-w-xl mx-auto">
          Udhyog-Setu — AI-Driven Scheme Matching Platform connected to Supabase Central Database. Always check official portal guidelines for formal application submissions.
        </p>
        <p className="text-xs font-semibold text-neutral-800">
          &copy; {new Date().getFullYear()} Udhyog-Setu. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
