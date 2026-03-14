import { useEffect, useRef, useState } from "react";
import { useResume } from "../../context/useResume";
import { generateResumePDF, toBackendResumePayload } from "../../../../../services/resumeAPI";
import { fetchTemplateSource } from "../../../../../services/templateAPI";
import nunjucks from "nunjucks";

const ResumePreview = ({ templateName }) => {
    const { resumeData } = useResume();
    const [viewHtml, setViewHtml] = useState("");
    const [pdfUrl, setPdfUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [iframeHeight, setIframeHeight] = useState("85vh"); // Default height
    const debounceRef = useRef(null);
    const urlRef = useRef("");
    const reqIdRef = useRef(0);
    const tmplCacheRef = useRef({ name: "", html: "", css: "", compiled: null });

    // Listen for height updates from the iframe
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data.resumeHeight) {
                setIframeHeight(`${event.data.resumeHeight}px`);
            }
        };
        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);

    // Fetch and compile the template source
    useEffect(() => {
        if (!templateName) return;
        let cancelled = false;
        setError("");
        setLoading(true);
        (async () => {
            try {
                const tpl = await fetchTemplateSource(templateName);
                if (cancelled) return;
                let compiled = null;
                try {
                    compiled = nunjucks.compile(tpl.html);
                } catch {
                    compiled = null;
                }
                tmplCacheRef.current = { ...tpl, compiled };
            } catch (e) {
                if (!cancelled) setError("Failed to load template.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [templateName]);

    // Render the resume preview
    useEffect(() => {
        if (!templateName) return;
        setError("");
        const currentReqId = ++reqIdRef.current;
        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(async () => {
            try {
                if (!tmplCacheRef.current.name) return;

                const payload = toBackendResumePayload(resumeData, templateName);
                const makeSafe = (val) =>
                    typeof val === "string" ? new nunjucks.runtime.SafeString(val) : val;

                // Mark rich text fields as safe for Nunjucks rendering
                const renderPayload = {
                    ...payload,
                    Summary: Array.isArray(payload.Summary) ? payload.Summary.map(makeSafe) : payload.Summary,
                    Projects: Array.isArray(payload.Projects) ? payload.Projects.map(p => ({ ...p, Description: Array.isArray(p.Description) ? p.Description.map(makeSafe) : (typeof p.Description === 'string' ? makeSafe(p.Description) : p.Description) })) : payload.Projects,
                    Experience: Array.isArray(payload.Experience) ? payload.Experience.map(e => ({ ...e, Description: Array.isArray(e.Description) ? e.Description.map(makeSafe) : (typeof e.Description === 'string' ? makeSafe(e.Description) : e.Description) })) : payload.Experience,
                };

                let rendered = "";
                try {
                    rendered = tmplCacheRef.current.compiled
                        ? tmplCacheRef.current.compiled.render(renderPayload)
                        : nunjucks.renderString(tmplCacheRef.current.html, renderPayload);
                } catch (e) {
                    // Fallback to server-side PDF generation on client-render failure
                    setLoading(true);
                    try {
                        const blob = await generateResumePDF(resumeData, templateName);
                        if (currentReqId !== reqIdRef.current) return;
                        const nextUrl = URL.createObjectURL(blob);
                        if (urlRef.current) URL.revokeObjectURL(urlRef.current);
                        urlRef.current = nextUrl;
                        setPdfUrl(nextUrl);
                        setViewHtml("");
                    } catch (serverErr) {
                        setError("Failed to render preview. Try again.");
                    } finally {
                        if (currentReqId === reqIdRef.current) setLoading(false);
                    }
                    return;
                }

                const cleaned = rendered
                    .replace(/<p>\\s*\\(\\s*\\)\\s*<\/p>/gi, '')
                    .replace(/\\(\\s*\\)/g, '')
                    .replace(/\\s{2,}/g, ' ');
                
                // Script to communicate iframe content height to the parent window
                const commsScript = `
                    <script>
                        const observer = new ResizeObserver(entries => {
                            const height = entries[0].target.scrollHeight;
                            window.parent.postMessage({ resumeHeight: height }, '*');
                        });
                        observer.observe(document.body);
                    </script>
                `;

                const htmlDoc = `<!doctype html><html><head><meta charset="utf-8"><style>body { margin: 0; } ${tmplCacheRef.current.css || ""}</style></head><body>${cleaned}${commsScript}</body></html>`;

                if (currentReqId !== reqIdRef.current) return;

                if (urlRef.current) URL.revokeObjectURL(urlRef.current);
                urlRef.current = "";
                setPdfUrl("");
                setViewHtml(htmlDoc);
                setIframeHeight("auto"); // Reset height for new content

            } catch (err) {
                setError("An error occurred while generating the preview.");
            }
        }, 100);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [resumeData, templateName]);

    useEffect(() => () => {
        if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    }, []);

    if (!templateName) {
        return <div className="p-6 text-gray-500">Select a template to preview.</div>;
    }

    return (
        <div className="w-full h-full flex flex-col justify-start items-center p-4">
            {loading && <div className="p-4 text-sm text-gray-600">Rendering preview...</div>}
            {error && <div className="p-4 text-sm text-red-600">{error}</div>}
            
            {!loading && viewHtml && (
                <iframe
                    title="Resume Preview"
                    srcDoc={viewHtml}
                    className="w-full border rounded shadow bg-white"
                    style={{ height: iframeHeight, display: 'block' }}
                    scrolling="no"
                />
            )}
            
            {!loading && !viewHtml && pdfUrl && (
                <iframe
                    title="Resume Preview (PDF)"
                    src={pdfUrl}
                    className="w-full h-[85vh] border rounded shadow"
                    style={{ display: 'block' }}
                />
            )}
        </div>
    );
};

export default ResumePreview;
