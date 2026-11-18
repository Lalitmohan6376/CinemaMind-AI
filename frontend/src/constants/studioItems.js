import {
  MessageSquare,
  DollarSign,
  Target,
  FileText
} from "../components/Icons";

export const studioItems = [
  {
    icon: MessageSquare,
    title: "Review Sentiment AI",
    description: "Analyze movie reception & audience tone",
    path: "/movie-review-analysis",
    badge: "NLP"
  },
  {
    icon: DollarSign,
    title: "Box Office Revenue",
    description: "Estimate potential commercial returns",
    path: "/movie-revenue",
    badge: "Regression"
  },
  {
    icon: Target,
    title: "Success Predictor",
    description: "Hit, Average, or Flop classification",
    path: "/movie-success",
    badge: "Classifier"
  },
  {
    icon: FileText,
    title: "Overview Summarizer",
    description: "Distill synopsis into key essence",
    path: "/overview-summarization",
    badge: "Summary"
  }
];

