export default function Dashboard() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Demo Recruiter Dashboard (Admin View)</h1>
      <ul className="list-disc pl-4">
        <li>Jane Doe – <a href="/report/demo123" className="text-blue-500 underline">View Report</a></li>
        <li>John Smith – <a href="#" className="text-gray-500">Coming Soon</a></li>
      </ul>
    </div>
  );
}
