const SkillsSection = ({ data, layout }) => {
  if (!data || data.length === 0) return null;

  return layout === 'columns' ? (
    <div className="grid grid-cols-3 gap-2">
      {data.map((skill, i) => (
        <div key={i} className="text-sm text-gray-700 dark:text-gray-300">
          {skill}
        </div>
      ))}
    </div>
  ) : (
    <ul className="flex flex-wrap gap-2">
      {data.map((skill, i) => (
        <li
          key={i}
          className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-xs font-medium shadow-sm"
        >
          {skill}
        </li>
      ))}
    </ul>
  );
};

export default SkillsSection;