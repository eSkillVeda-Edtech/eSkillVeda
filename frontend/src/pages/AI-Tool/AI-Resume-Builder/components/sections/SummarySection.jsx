import DOMPurify from 'dompurify';

const SummarySection = ({ data }) => {
  if (!data || (Array.isArray(data) ? data.length === 0 : !data.trim())) return null;
  if (Array.isArray(data)) {
    return (
      <ul className="list-disc pl-6 leading-relaxed" style={{ color: '#111' }}>
        {data.map((point, idx) => (
          <li key={idx}>{point}</li>
        ))}
      </ul>
    );
  }
  const sanitized = DOMPurify.sanitize(String(data));
  return <div className="leading-relaxed" style={{ color: '#111' }} dangerouslySetInnerHTML={{ __html: sanitized }} />;
};
export default SummarySection;
