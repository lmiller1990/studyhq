export type DynamoSchema = {
  User: {
    email: string;
    sk: "PROFILE";
    credit: number;
  };

  Thread: {
    email: string;
    //  `thread#${string}`;
    sk: string;
    openai_id: string;
    summary?: string;
  };

  Exam: {
    email: string;
    //  `exam#${string}`;
    sk: string;
    openai_id: string;
    questions: string;
    completed: boolean;
    summary?: string;
    answers?: string;
    feedback?: string;
    created_at: string;
  };
};
