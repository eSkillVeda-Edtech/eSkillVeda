import DOMPurify from 'dompurify';

const ExperienceSection = ({ data }) => {
  if (!data || data.length === 0) return null;
  return (
    <div className="space-y-2">
      {data.map((exp, i) => (
        <div key={i} className="mb-1">
          <div className="font-semibold text-gray-900">{exp.title} {exp.company && <span className="text-gray-500 font-normal">@ {exp.company}</span>}</div>
          {Array.isArray(exp.description) ? (
            <ul className="list-disc pl-6 text-sm text-gray-600 ml-1">
              {exp.description.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          ) : (
            <div className="prose prose-sm text-gray-700 ml-1" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(String(exp.description || '')) }} />
          )}
        </div>
      ))}
    </div>
  );
};
export default ExperienceSection;