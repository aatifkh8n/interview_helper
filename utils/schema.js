import { boolean, integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const MockInterview = pgTable('mockInterview',{
    id:serial('id').primaryKey(),
    jsonMockResp:text('jsonMockResp').notNull(),
    jobPosition:varchar('jobPosition').notNull(),
    jobDesc:varchar('jobDesc').notNull(),
    type: integer('type').default(0),
    submitted: boolean('submitted').default(false),
    jobExperience:varchar('jobExperience').notNull(),
    fileText:text('fileText'),
    createdBy:varchar('createdBy').notNull(),
    createdAt:varchar('createdAt'),
    mockId:varchar('mockId').notNull()
})

export const UserAnswer = pgTable('userAnswer',{
    id:serial('id').primaryKey(),
    mockIdRef:varchar('mockId').notNull(),
    question:varchar('question').notNull(),
    correctAns:text('correctAns'),
    userAns:text('userAns'),
    feedback:text('feedback'),
    rating:varchar('rating'),
    userEmail:varchar('userEmail'),
    createdAt:varchar('createdAt')
})

export const TechStack = pgTable('techStack',{
    id:serial('id').primaryKey(),
    techStack:varchar('techStack').notNull(),
    suggestions:text('suggestions').notNull(),
    createdBy:varchar('createdBy'),
    createdAt:varchar('createdAt')
})

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