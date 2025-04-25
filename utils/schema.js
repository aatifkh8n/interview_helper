import {
  boolean,
  decimal,
  integer,
  pgTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";

// level 1 relations
export const Interview = pgTable("interview", {
  id: serial("id").primaryKey(),
  title: varchar("title").default("Untitled"),
  type: integer("type").default(0), // 0 = MockInterview, 1 = LiveInterview
  status: integer("status").default(1), // 0 = deleted, 1 = active
  createdBy: varchar("createdBy").notNull(),
  createdAt: varchar("createdAt"),
  // mockId: varchar("mockId").notNull(),
});

// level 2 relations
export const MockInterview = pgTable("mockInterview", {
  id: serial("id").primaryKey(),
  qna: text("qna").notNull(),
  submitted: boolean("submitted").default(false),
  score: integer("score").default(0),
  type: integer("type").default(0), // 0 = job, 1 = thesis, 2 = educational
  
  interviewId: integer("interviewId")
  .notNull()
  .references(() => Interview.id), // Foreign key to Interview (change from Interview.mockId)
});

export const MockInterviewResponse = pgTable("mockInterviewResponse", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  userAnswer: text("userAnswer").notNull(),
  correctAnswer: text("correctAnswer").notNull(),
  feedback: text('feedback').notNull(),
  rating: decimal("rating").default(0.0),
  createdAt: varchar("createdAt"),

  interviewId: integer("interviewId")
    .notNull()
    .references(() => Interview.id), // Foreign key to Interview
});

export const LiveInterview = pgTable("liveInterview", {
  id: serial("id").primaryKey(),
  type: integer("type").default(0), // 0 = job, 1 = thesis, 2 = educational

  interviewId: integer("interviewId")
    .notNull()
    .references(() => Interview.id), // Foreign key to Interview (change from Interview.mockId)
});

export const JobInterview = pgTable("jobInterview", {
  id: serial("id").primaryKey(),
  position: varchar("position").notNull(),
  description: text("description"),
  experience: decimal("experience").default(0),
  resumeContent: text("resumeContent").notNull(),
  otherDocsContent: text("otherDocsContent"),

  interviewId: integer("interviewId")
    .notNull()
    .references(() => Interview.id), // Foreign key to Interview (change from Interview.mockId)
});

export const ThesisInterview = pgTable("thesisInterview", {
  id: serial("id").primaryKey(),
  domain: varchar("domain").notNull(),
  resumeContent: text("thesisContent").notNull(),
  otherDocsContent: text("otherDocsContent"),

  interviewId: integer("interviewId")
    .notNull()
    .references(() => Interview.id), // Foreign key to Interview (change from Interview.mockId)
});

export const EducationalInterview = pgTable("educationalInterview", {
  id: serial("id").primaryKey(),
  educationLevel: varchar("educationLevel").notNull(),
  resumeContent: text("resumeContent").notNull(),
  educationalDocsContent: text("educationalDocsContent").notNull(),

  interviewId: integer("interviewId")
    .notNull()
    .references(() => Interview.id), // Foreign key to Interview (change from Interview.mockId)
});

export const TechStack = pgTable("techStack", {
  id: serial("id").primaryKey(),
  techStack: varchar("techStack").notNull(),
  suggestions: text("suggestions").notNull(),
  createdBy: varchar("createdBy"),
  createdAt: varchar("createdAt"),
});

// INSERT INTO"public"."techStack"
//   ("techStack","suggestions","createdBy")
//   VALUES ("Full Stack Developer", "React, Node.js, Express, MongoDB, TypeScript", "atif.jamil@egeeksglobal.com"),
//     ("Frontend Developer", "React, Vue.js, Angular, TypeScript, Tailwind CSS", "atif.jamil@egeeksglobal.com"),
//     ("Backend Developer", "Python, Django, Flask, Java Spring, PostgreSQL", "atif.jamil@egeeksglobal.com"),
//     ("Software Engineer", "Java, C++, Python, AWS, Microservices", "atif.jamil@egeeksglobal.com"),
//     ("DevOps Engineer", "Docker, Kubernetes, Jenkins, AWS, Azure", "atif.jamil@egeeksglobal.com"),
//     ("Data Scientist", "Python, TensorFlow, PyTorch, Pandas, NumPy", "atif.jamil@egeeksglobal.com"),
//     ("Machine Learning Engineer", "Python, scikit-learn, Keras, TensorFlow", "atif.jamil@egeeksglobal.com"),
//     ("Cloud Engineer", "AWS, Azure, GCP, Terraform, Kubernetes", "atif.jamil@egeeksglobal.com"),
//     ("Mobile App Developer", "React Native, Flutter, Swift, Kotlin", "atif.jamil@egeeksglobal.com"),
//     ("UI/UX Designer", "Figma, Sketch, Adobe XD, InVision", "atif.jamil@egeeksglobal.com");
