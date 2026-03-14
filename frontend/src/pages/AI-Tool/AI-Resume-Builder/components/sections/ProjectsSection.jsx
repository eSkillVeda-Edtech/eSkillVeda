import DOMPurify from 'dompurify';

const ProjectsSection = ({ data }) => {
  if (!data || data.length === 0) return null;
  return (
    <div className="space-y-2">
      {data.map((p, i) => (
        <div key={i} className="mb-1">
          <div className="font-semibold text-gray-900">{p.name}</div>
          {Array.isArray(p.description) ? (
            <ul className="list-disc pl-6 text-sm text-gray-600 ml-1">
              {p.description.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          ) : (
            <div className="prose prose-sm text-gray-700 ml-1" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(String(p.description || '')) }} />
          )}
        </div>
      ))}
    </div>
  );
};
export default ProjectsSection;