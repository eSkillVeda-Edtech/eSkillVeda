export const roadmapData = {
  "rag-for-beginners": {
    title: "RAG for Beginners",
    subtitle:
      "A comprehensive learning roadmap for Retrieval-Augmented Generation",
    modules: [
      {
        id: "m1",
        title: "Phase 1: Foundations",
        isLabelOnly: true,
      },
      {
        id: "m2",
        title: "Introduction to RAG",
        status: "current",
        branchDirection: "right",
        description:
          "Retrieval-Augmented Generation (RAG) is a framework that enhances LLM outputs by dynamically fetching relevant external knowledge at inference time. Instead of relying solely on trained weights, RAG systems retrieve grounded facts from a knowledge base, dramatically reducing hallucinations and keeping responses current.",
        resources: {
          free: [
            {
              type: "Article",
              title: "What is RAG? A Beginner's Guide",
              url: "#",
            },
            {
              type: "Video",
              title: "RAG Explained in 10 Minutes – Andrej Karpathy",
              url: "#",
            },
            {
              type: "Paper",
              title:
                "Retrieval-Augmented Generation for NLP (Lewis et al., 2020)",
              url: "#",
            },
          ],
          paid: [
            {
              type: "Course",
              title: "LangChain & Vector Databases in Production – Activeloop",
              url: "#",
            },
            {
              type: "Course",
              title: "Building RAG Applications – DeepLearning.AI",
              url: "#",
            },
          ],
        },
        topics: [
          {
            title: "Parametric vs External Memory",
            description:
              "Understanding the difference between an LLM's internal trained weights (parametric) and external knowledge bases.",
            subtopics: [
              "LLM parametric knowledge",
              "External knowledge base advantages",
              "Hybrid combination approaches",
            ],
            resources: {
              free: [
                {
                  type: "Article",
                  title: "Parametric vs Non-Parametric Memory in LLMs",
                  url: "#",
                },
                {
                  type: "Video",
                  title: "How LLMs Store Knowledge – Explained Visually",
                  url: "#",
                },
              ],
              paid: [
                {
                  type: "Course",
                  title: "LLM Foundations – Fast.AI",
                  url: "#",
                },
              ],
            },
          },
          {
            title: "Accuracy & Grounding",
            description:
              "Techniques to reduce AI hallucinations by grounding responses in factual, retrieved data.",
            subtopics: [
              "Reducing hallucinations",
              "Grounding factual data",
              "Relevance Enhancement (Precision/Coherence)",
            ],
            resources: {
              free: [
                {
                  type: "Article",
                  title: "Hallucination in LLMs: Causes and Mitigations",
                  url: "#",
                },
                {
                  type: "Paper",
                  title: "TruthfulQA: Measuring How Models Mimic Falsehoods",
                  url: "#",
                },
              ],
              paid: [
                {
                  type: "Course",
                  title: "Reliable AI Systems – Coursera",
                  url: "#",
                },
              ],
            },
          },
        ],
      },
      {
        id: "m3",
        title: "High-Level Architecture",
        status: "locked",
        branchDirection: "left",
        description:
          "The RAG architecture consists of two distinct phases: an offline ingestion pipeline that processes and indexes your knowledge corpus, and an online query-time execution layer that retrieves and synthesizes answers in real time. Understanding these phases is key to designing scalable, production-ready systems.",
        resources: {
          free: [
            {
              type: "Article",
              title: "RAG Architecture Patterns – LlamaIndex Docs",
              url: "#",
            },
            {
              type: "Video",
              title: "End-to-End RAG Pipeline Walkthrough",
              url: "#",
            },
            {
              type: "Article",
              title: "Naive vs Advanced RAG vs Modular RAG",
              url: "#",
            },
          ],
          paid: [
            { type: "Course", title: "RAG with LangChain – Udemy", url: "#" },
            {
              type: "Course",
              title: "Vector Database Fundamentals – Pinecone Academy",
              url: "#",
            },
          ],
        },
        topics: [
          {
            title: "Ingestion Phase (Offline)",
            description:
              "The background process of acquiring, parsing, chunking, and indexing documents into a database.",
            subtopics: [
              "Document preprocessing",
              "Chunking and embedding",
              "Vector/Hybrid indexing",
            ],
            resources: {
              free: [
                {
                  type: "Article",
                  title: "Document Ingestion Pipelines for RAG",
                  url: "#",
                },
                {
                  type: "Video",
                  title: "Building a Document Loader from Scratch",
                  url: "#",
                },
              ],
              paid: [
                {
                  type: "Course",
                  title: "Data Engineering for LLMs – DataCamp",
                  url: "#",
                },
              ],
            },
          },
          {
            title: "Query-Time Execution (Online)",
            description:
              "The active process where a user's query is interpreted, relevant context is retrieved, and the LLM synthesizes an answer.",
            subtopics: [
              "Query routing",
              "Context retrieval & reranking",
              "LLM response synthesis",
            ],
            resources: {
              free: [
                {
                  type: "Article",
                  title: "Query Processing in RAG Systems",
                  url: "#",
                },
                {
                  type: "Paper",
                  title:
                    "Self-RAG: Learning to Retrieve, Generate, and Critique",
                  url: "#",
                },
              ],
              paid: [
                {
                  type: "Course",
                  title: "Production LLM Systems – O'Reilly",
                  url: "#",
                },
              ],
            },
          },
        ],
      },
      {
        id: "m4",
        title: "Phase 2: Ingestion Pipeline",
        isLabelOnly: true,
      },
      {
        id: "m5",
        title: "Document Processing",
        status: "locked",
        branchDirection: "right",
        description:
          "Document processing is the foundation of any RAG system. It involves extracting clean, structured text from diverse file formats, then splitting that text into optimal chunks that preserve semantic coherence while fitting within embedding model constraints.",
        resources: {
          free: [
            {
              type: "Article",
              title: "Text Chunking Strategies for RAG – Pinecone",
              url: "#",
            },
            {
              type: "Video",
              title: "Advanced Document Parsing with LlamaParse",
              url: "#",
            },
            {
              type: "Article",
              title: "How to Handle PDFs, HTML, and Markdown in RAG",
              url: "#",
            },
          ],
          paid: [
            {
              type: "Course",
              title: "Document AI & Intelligent Parsing – Google Cloud",
              url: "#",
            },
            {
              type: "Course",
              title: "LlamaIndex: Data Framework for LLM Apps – Udemy",
              url: "#",
            },
          ],
        },
        topics: [
          {
            title: "Parsing & Cleaning",
            description:
              "Extracting text from various formats while preserving structure and removing noise.",
            subtopics: [
              "Format Support (PDF, HTML, MD, Wiki, Confluence)",
              "Structural Fidelity (Tables, Headers, Code Blocks)",
              "Noise removal & Log cleaning",
            ],
            resources: {
              free: [
                {
                  type: "Article",
                  title:
                    "PDF Parsing Libraries Compared: PyMuPDF vs pdfplumber",
                  url: "#",
                },
                {
                  type: "Video",
                  title: "Cleaning & Preprocessing Text for LLMs",
                  url: "#",
                },
              ],
              paid: [
                {
                  type: "Course",
                  title: "NLP Preprocessing Masterclass – Udemy",
                  url: "#",
                },
              ],
            },
          },
          {
            title: "Chunking Strategies",
            description:
              "Breaking large documents into semantic units that fit into an LLM's context window.",
            subtopics: [
              "Recursive Character Chunking",
              "Fixed-Token Windowing",
              "Semantic Chunking",
              "Structure-Aware Chunking (Markdown/HTML tags)",
            ],
            resources: {
              free: [
                {
                  type: "Article",
                  title:
                    "5 Chunking Strategies Every RAG Developer Should Know",
                  url: "#",
                },
                {
                  type: "Video",
                  title: "Semantic Chunking with Sentence Transformers",
                  url: "#",
                },
              ],
              paid: [
                {
                  type: "Course",
                  title: "Advanced RAG Techniques – DeepLearning.AI",
                  url: "#",
                },
              ],
            },
          },
        ],
      },
      {
        id: "m6",
        title: "Embeddings & Indexing",
        status: "locked",
        branchDirection: "left",
        description:
          "Embeddings convert text into high-dimensional numerical vectors that encode semantic meaning. These vectors are then stored in specialized vector databases that enable lightning-fast similarity searches across millions of documents, forming the retrieval backbone of any RAG system.",
        resources: {
          free: [
            {
              type: "Article",
              title: "What are Text Embeddings? – OpenAI Blog",
              url: "#",
            },
            {
              type: "Video",
              title: "FAISS: Billion-Scale Similarity Search – Meta AI",
              url: "#",
            },
            {
              type: "Article",
              title: "Choosing the Right Vector Database in 2025",
              url: "#",
            },
          ],
          paid: [
            {
              type: "Course",
              title:
                "Vector Databases: From Embeddings to Applications – Pinecone",
              url: "#",
            },
            {
              type: "Course",
              title: "Embedding Models Deep Dive – Hugging Face",
              url: "#",
            },
          ],
        },
        topics: [
          {
            title: "Vector Conversion",
            description:
              "Transforming text chunks into numerical vectors (embeddings) that represent semantic meaning.",
            subtopics: ["Embedding models", "Dimensionality", "Normalization"],
            resources: {
              free: [
                {
                  type: "Article",
                  title:
                    "Sentence Transformers: Sentence Embeddings using BERT",
                  url: "#",
                },
                {
                  type: "Video",
                  title: "How Embeddings Capture Meaning – 3Blue1Brown Style",
                  url: "#",
                },
              ],
              paid: [
                {
                  type: "Course",
                  title: "Applied Machine Learning – fast.ai",
                  url: "#",
                },
              ],
            },
          },
          {
            title: "Databases & Indexing Strategy",
            description:
              "Storing vectors efficiently for fast similarity search, enriched with metadata.",
            subtopics: [
              "Vector DBs (Pinecone, Milvus, pgvector, FAISS, Weaviate)",
              "Metadata enrichment (Timestamps, Tags, ACLs)",
              "Dense, Sparse, and Hybrid indexing",
            ],
            resources: {
              free: [
                {
                  type: "Article",
                  title:
                    "pgvector vs Pinecone vs Weaviate: A Practical Comparison",
                  url: "#",
                },
                {
                  type: "Video",
                  title: "Building a Vector DB from Scratch in Python",
                  url: "#",
                },
              ],
              paid: [
                {
                  type: "Course",
                  title: "Weaviate Vector Database Course – Weaviate Academy",
                  url: "#",
                },
              ],
            },
          },
        ],
      },
      {
        id: "m7",
        title: "Phase 3: Query-Time Execution",
        isLabelOnly: true,
      },
      {
        id: "m8",
        title: "Retrieval & Reranking",
        status: "locked",
        branchDirection: "right",
        description:
          "Retrieval is the core of RAG — finding the most relevant chunks from potentially millions of documents. Modern retrieval combines dense vector search with sparse keyword search (BM25) in a hybrid approach. Reranking then acts as a second pass, using heavier cross-encoder models to promote the absolute best context to the top.",
        resources: {
          free: [
            {
              type: "Article",
              title: "Dense vs Sparse Retrieval: A Practical Guide",
              url: "#",
            },
            {
              type: "Paper",
              title:
                "ColBERT: Efficient and Effective Passage Search (Omar Khattab)",
              url: "#",
            },
            {
              type: "Video",
              title: "Hybrid Search Explained – Weaviate",
              url: "#",
            },
          ],
          paid: [
            {
              type: "Course",
              title: "Information Retrieval & Search Engines – Coursera",
              url: "#",
            },
            {
              type: "Course",
              title: "Reranking with Cross-Encoders – Hugging Face",
              url: "#",
            },
          ],
        },
        topics: [
          {
            title: "Retrieval Techniques",
            description:
              "Finding the most relevant chunks from the database using diverse search strategies.",
            subtopics: [
              "Dense & Sparse Retrieval (Embeddings vs BM25)",
              "Hybrid & Late-Interaction Retrieval (ColBERT)",
              "Query Expansion (Synonyms, Paraphrasing)",
            ],
            resources: {
              free: [
                {
                  type: "Article",
                  title: "BM25: The Baseline You Should Always Try First",
                  url: "#",
                },
                {
                  type: "Video",
                  title: "Query Expansion Techniques for Better RAG",
                  url: "#",
                },
              ],
              paid: [
                {
                  type: "Course",
                  title: "Applied NLP with Transformers – O'Reilly",
                  url: "#",
                },
              ],
            },
          },
          {
            title: "Reranking Layer",
            description:
              "Refining and re-ordering initial retrieval results to prioritize the absolute best context.",
            subtopics: [
              "Cross-Encoders & LLM-Based Reranking",
              "Maximal Marginal Relevance (MMR)",
              "Filtering & Deduplication",
            ],
            resources: {
              free: [
                {
                  type: "Article",
                  title: "Reranking with Cross-Encoders: A Complete Guide",
                  url: "#",
                },
                {
                  type: "Paper",
                  title:
                    "MMR: Maximal Marginal Relevance for Diverse Retrieval",
                  url: "#",
                },
              ],
              paid: [
                {
                  type: "Course",
                  title: "Advanced RAG & Reranking – LlamaIndex",
                  url: "#",
                },
              ],
            },
          },
        ],
      },
      {
        id: "m9",
        title: "Routing Layer",
        status: "locked",
        branchDirection: "left",
        description:
          "Intelligent routing determines the optimal processing path for every incoming query before retrieval begins. This prevents unnecessary computation by directing simple queries to lightweight handlers and complex agentic tasks to specialized pipelines, dramatically improving both latency and accuracy.",
        resources: {
          free: [
            {
              type: "Article",
              title: "Query Routing in RAG Pipelines – LlamaIndex Blog",
              url: "#",
            },
            {
              type: "Video",
              title: "Building a Multi-Index Router with LangChain",
              url: "#",
            },
          ],
          paid: [
            {
              type: "Course",
              title: "Agentic RAG Systems – DeepLearning.AI",
              url: "#",
            },
            {
              type: "Course",
              title: "LangGraph: Building Stateful AI Agents",
              url: "#",
            },
          ],
        },
        topics: [
          {
            title: "Intelligent Routing",
            description:
              "Determining the best processing path for a query before retrieval begins.",
            subtopics: [
              "Domain Routers (Multi-index)",
              "Intent Routers (Retrieve vs Generate)",
              "Tool/Agentic Routers",
            ],
            resources: {
              free: [
                {
                  type: "Article",
                  title: "Intent Classification for RAG Routing",
                  url: "#",
                },
                {
                  type: "Video",
                  title: "Multi-Agent RAG with Tool Routing – Andrew Ng",
                  url: "#",
                },
              ],
              paid: [
                {
                  type: "Course",
                  title: "LangChain: Agents & Tools – Udemy",
                  url: "#",
                },
              ],
            },
          },
        ],
      },
      {
        id: "m10",
        title: "Phase 4: Enterprise & Production",
        isLabelOnly: true,
      },
      {
        id: "m11",
        title: "Middleware & Security",
        status: "locked",
        branchDirection: "right",
        description:
          "Production RAG systems require robust middleware layers for observability, caching, and rate limiting, alongside enterprise-grade security controls. This phase covers the operational concerns that separate a proof-of-concept from a system trusted by thousands of users with sensitive data.",
        resources: {
          free: [
            {
              type: "Article",
              title: "Observability for LLM Apps: Tracing with LangSmith",
              url: "#",
            },
            {
              type: "Article",
              title: "PII Detection and Data Masking in AI Pipelines",
              url: "#",
            },
            {
              type: "Video",
              title: "Rate Limiting and Caching for Production LLM Apps",
              url: "#",
            },
          ],
          paid: [
            {
              type: "Course",
              title: "LLMOps: Deploying LLMs to Production – DataCamp",
              url: "#",
            },
            {
              type: "Course",
              title: "Enterprise AI Security – SANS Institute",
              url: "#",
            },
          ],
        },
        topics: [
          {
            title: "Middleware & Observability",
            description:
              "Ensuring system reliability, monitoring performance, caching, and content safety.",
            subtopics: [
              "Event logging & Tracing",
              "Caching & Rate limiting",
              "Content Safety & PII Detection",
            ],
            resources: {
              free: [
                {
                  type: "Article",
                  title:
                    "Building an LLM Observability Stack with OpenTelemetry",
                  url: "#",
                },
                {
                  type: "Video",
                  title: "Semantic Caching for RAG – Reduce Costs by 60%",
                  url: "#",
                },
              ],
              paid: [
                {
                  type: "Course",
                  title: "MLOps Fundamentals – Google Cloud",
                  url: "#",
                },
              ],
            },
          },
          {
            title: "Security & Governance",
            description:
              "Protecting sensitive data, enforcing access controls, and complying with regulations.",
            subtopics: [
              "ACL-Based Filtering & Tenant Boundaries",
              "Compliance (GDPR, HIPAA, SOC 2)",
              "Data Encryption & Authentication",
            ],
            resources: {
              free: [
                {
                  type: "Article",
                  title:
                    "GDPR Compliance for AI Applications: A Developer's Guide",
                  url: "#",
                },
                {
                  type: "Video",
                  title: "Multi-Tenant RAG: Isolating Data Between Users",
                  url: "#",
                },
              ],
              paid: [
                {
                  type: "Course",
                  title: "AI Governance & Compliance – Coursera",
                  url: "#",
                },
              ],
            },
          },
        ],
      },
      {
        id: "m12",
        title: "End-to-End Flow",
        status: "locked",
        branchDirection: "left",
        description:
          "The final phase ties everything together: running the complete RAG loop, evaluating system quality with metrics like RAGAS and faithfulness scores, and establishing continuous improvement cycles. This is where engineering discipline, experimentation, and product thinking converge.",
        resources: {
          free: [
            {
              type: "Article",
              title: "RAGAS: Automated Evaluation of RAG Pipelines",
              url: "#",
            },
            {
              type: "Paper",
              title: "Benchmarking RAG Systems: A Framework (2024)",
              url: "#",
            },
            {
              type: "Video",
              title:
                "The Full RAG Production Loop – From Indexing to Monitoring",
              url: "#",
            },
          ],
          paid: [
            {
              type: "Course",
              title: "Building Production-Ready RAG – Maven",
              url: "#",
            },
            {
              type: "Course",
              title: "LLM Evaluation Masterclass – Weights & Biases",
              url: "#",
            },
          ],
        },
        topics: [
          {
            title: "Production Best Practices",
            description:
              "The complete lifecycle of evaluating, monitoring, and continuously improving the RAG system.",
            subtopics: [
              "The 5-Step RAG Loop",
              "Evaluation metrics & Golden Datasets",
              "A/B Testing & Continuous monitoring",
            ],
            resources: {
              free: [
                {
                  type: "Article",
                  title: "Golden Dataset Creation for RAG Evaluation",
                  url: "#",
                },
                {
                  type: "Video",
                  title: "A/B Testing LLM Pipelines in Production",
                  url: "#",
                },
              ],
              paid: [
                {
                  type: "Course",
                  title: "LLMOps with Vertex AI – Google Cloud Skills Boost",
                  url: "#",
                },
              ],
            },
          },
        ],
      },
    ],
  },
};
