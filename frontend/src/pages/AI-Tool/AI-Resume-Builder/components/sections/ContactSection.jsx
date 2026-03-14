const ContactSection = ({ data }) => {
  if (!data || !data.contact) return null;
  return (
    <section className="mb-4">
      <div className="break-words">
        <h1 className="text-2xl font-bold mb-1 text-white">{data.contact.name}</h1>
        <div className="text-sm text-white space-y-1">
          {data.contact.email && <div className="break-all text-xs">{data.contact.email}</div>}
          {data.contact.phone && <div>{data.contact.phone}</div>}
          {data.contact.linkedin && (
            <div>
              <a href={data.contact.linkedin} className="underline text-white" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;