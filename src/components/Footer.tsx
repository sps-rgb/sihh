export default function Footer() {
  return (
    <footer className="bg-gray-100 py-8 text-center mt-auto">
      <div className="container mx-auto px-4">
        <p className="text-sm text-gray-600 mb-2">
          ⚠️ Demo Version — Scheme information shown is mock data for demonstration only.
        </p>
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} SchemeMatch. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
