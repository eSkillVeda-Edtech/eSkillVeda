const CertificationsSection = ({ data }) => {
  if (!data || data.length === 0) return null;
  return (
    <ul className="list-disc ml-6 space-y-1">
      {data.map((c, i) => <li key={i} className="text-gray-800 text-sm">{c}</li>)}
    </ul>
  );
};
export default CertificationsSection;
