const EducationSection = ({ data }) => {
  if (!data || data.length === 0) return null;
  return (
    <div className="space-y-2">
      {data.map((e, i) => (
        <div key={i} className="mb-1">
          <div className="font-semibold text-gray-900">{e.degree}</div>
          <div className="text-sm text-gray-600 ml-1">{e.institute} {e.graduationDate && <span>({e.graduationDate})</span>}</div>
        </div>
      ))}
    </div>
  );
};
export default EducationSection;