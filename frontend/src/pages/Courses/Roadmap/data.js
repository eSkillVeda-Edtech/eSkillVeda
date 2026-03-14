// data.js
export const roadmapData = {
  "ai-engineering": {
    title: "AI Engineering Mastery",
    modules: [
      {
        id: "m1",
        title: "Programming & CS Fundamentals",
        status: "current",
        branchDirection: "right",
        topics: [
          {
            title: "Python Proficiency",
            subtopics: ["Advanced OOP", "Generators & Decorators", "Asyncio"],
          },
          {
            title: "Data Structures",
            subtopics: ["Graphs", "Trees", "Hash Maps", "Big O"],
          },
          {
            title: "Version Control",
            subtopics: ["Git Advanced", "CI/CD Basics"],
          },
        ],
      },
      {
        id: "m2",
        title: "Mathematical Foundations",
        isLabelOnly: true,
      },
      {
        id: "m3",
        title: "Applied Mathematics",
        status: "locked",
        branchDirection: "left",
        topics: [
          {
            title: "Linear Algebra",
            subtopics: ["Matrices", "Eigenvalues", "SVD"],
          },
          {
            title: "Calculus",
            subtopics: ["Partial Derivatives", "Chain Rule", "Gradients"],
          },
          {
            title: "Statistics",
            subtopics: ["Probability Distributions", "Bayesian Inference"],
          },
        ],
      },
      {
        id: "m4",
        title: "Data Processing & EDA",
        status: "locked",
        branchDirection: "right",
        topics: [
          {
            title: "Data Manipulation",
            subtopics: ["Pandas", "Polars", "NumPy"],
          },
          {
            title: "Databases",
            subtopics: ["SQL", "NoSQL", "Data Warehousing"],
          },
          {
            title: "Visualization",
            subtopics: ["Matplotlib", "Seaborn", "Plotly"],
          },
        ],
      },
      {
        id: "m5",
        title: "Core Machine Learning",
        isLabelOnly: true,
      },
      {
        id: "m6",
        title: "Predictive Modeling",
        status: "locked",
        branchDirection: "left",
        topics: [
          {
            title: "Supervised Learning",
            subtopics: ["Linear/Log Regression", "Random Forests", "XGBoost"],
          },
          {
            title: "Unsupervised Learning",
            subtopics: ["K-Means", "PCA", "DBSCAN"],
          },
          {
            title: "Model Evaluation",
            subtopics: ["Cross-Validation", "ROC-AUC", "F1 Score"],
          },
        ],
      },
      {
        id: "m7",
        title: "Deep Learning Foundations",
        status: "locked",
        branchDirection: "right",
        topics: [
          {
            title: "Neural Networks",
            subtopics: [
              "Perceptrons",
              "Backpropagation",
              "Activation Functions",
            ],
          },
          { title: "Frameworks", subtopics: ["PyTorch", "TensorFlow", "JAX"] },
          {
            title: "Architectures",
            subtopics: ["CNNs (Vision)", "RNNs/LSTMs (Time Series)"],
          },
        ],
      },
      {
        id: "m8",
        title: "Generative AI & LLMs",
        isLabelOnly: true,
      },
      {
        id: "m9",
        title: "Large Language Models",
        status: "locked",
        branchDirection: "left",
        topics: [
          {
            title: "Transformer Architecture",
            subtopics: ["Self-Attention", "Encoders/Decoders"],
          },
          {
            title: "Model Tuning",
            subtopics: ["PEFT", "LoRA", "QLoRA", "RLHF"],
          },
          {
            title: "Prompt Engineering",
            subtopics: ["Few-Shot", "Chain of Thought", "Tree of Thoughts"],
          },
        ],
      },
      {
        id: "m10",
        title: "Applied AI Systems",
        status: "locked",
        branchDirection: "right",
        topics: [
          {
            title: "RAG Systems",
            subtopics: [
              "Vector DBs (Pinecone/Milvus)",
              "Chunking Strategies",
              "Semantic Search",
            ],
          },
          {
            title: "AI Agents",
            subtopics: ["LangChain", "LlamaIndex", "Autonomous Workflows"],
          },
          {
            title: "Multimodal AI",
            subtopics: ["Vision-Language Models", "Audio Processing"],
          },
        ],
      },
      {
        id: "m11",
        title: "Production & MLOps",
        isLabelOnly: true,
      },
      {
        id: "m12",
        title: "Deployment & Scaling",
        status: "locked",
        branchDirection: "left",
        topics: [
          { title: "Containerization", subtopics: ["Docker", "Kubernetes"] },
          {
            title: "Model Serving",
            subtopics: ["FastAPI", "Triton", "Ray Serve", "vLLM"],
          },
          {
            title: "Observability",
            subtopics: ["MLflow", "Weights & Biases", "Drift Detection"],
          },
        ],
      },
    ],
  },
};
