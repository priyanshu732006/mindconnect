
import { Assessment, AssessmentId } from "./types";

export const assessmentData: Record<AssessmentId, Assessment> = {
    "phq-9": {
        id: "phq-9",
        name: "PHQ-9 Depression Screening",
        description: "Measures the severity of depression symptoms.",
        questions: [
            { text: "Little interest or pleasure in doing things" },
            { text: "Feeling down, depressed, or hopeless" },
            { text: "Trouble falling or staying asleep, or sleeping too much" },
            { text: "Feeling tired or having little energy" },
            { text: "Poor appetite or overeating" },
            { text: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down" },
            { text: "Trouble concentrating on things, such as reading the newspaper or watching television" },
            { text: "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual" },
            { text: "Thoughts that you would be better off dead or of hurting yourself in some way" }
        ],
        options: [
            { text: "Not at all", value: 0 },
            { text: "Several days", value: 1 },
            { text: "More than half the days", value: 2 },
            { text: "Nearly every day", value: 3 }
        ],
        interpretation: [
            { minScore: 20, text: "Severe depression" },
            { minScore: 15, text: "Moderately severe depression" },
            { minScore: 10, text: "Moderate depression" },
            { minScore: 5, text: "Mild depression" },
            { minScore: 0, text: "Minimal or no depression" }
        ]
    },
    "gad-7": {
        id: "gad-7",
        name: "GAD-7 Anxiety Screening",
        description: "Measures the severity of generalized anxiety disorder.",
        questions: [
            { text: "Feeling nervous, anxious, or on edge" },
            { text: "Not being able to stop or control worrying" },
            { text: "Worrying too much about different things" },
            { text: "Trouble relaxing" },
            { text: "Being so restless that it is hard to sit still" },
            { text: "Becoming easily annoyed or irritable" },
            { text: "Feeling afraid, as if something awful might happen" }
        ],
        options: [
            { text: "Not at all", value: 0 },
            { text: "Several days", value: 1 },
            { text: "More than half the days", value: 2 },
            { text: "Nearly every day", value: 3 }
        ],
        interpretation: [
            { minScore: 15, text: "Severe anxiety" },
            { minScore: 10, text: "Moderate anxiety" },
            { minScore: 5, text: "Mild anxiety" },
            { minScore: 0, text: "Minimal or no anxiety" }
        ]
    },
    "ghq-12": {
        id: "ghq-12",
        name: "GHQ-12 General Well-being",
        description: "A screening tool for identifying minor psychiatric disorders.",
        questions: [
            { text: "Been able to concentrate on whatever you're doing?" },
            { text: "Lost much sleep over worry?" },
            { text: "Felt that you were playing a useful part in things?" },
            { text: "Felt capable of making decisions about things?" },
            { text: "Felt constantly under strain?" },
            { text: "Felt you couldn't overcome your difficulties?" },
            { text: "Been able to enjoy your normal day-to-day activities?" },
            { text: "Been able to face up to your problems?" },
            { text: "Been feeling unhappy and depressed?" },
            { text: "Been losing confidence in yourself?" },
            { text: "Been thinking of yourself as a worthless person?" },
            { text: "Felt reasonably happy, all things considered?" }
        ],
        options: [
            { text: "Better than usual", value: 0 },
            { text: "Same as usual", value: 1 },
            { text: "Less than usual", value: 2 },
            { text: "Much less than usual", value: 3 }
        ],
        interpretation: [
            { minScore: 21, text: "High psychological distress" },
            { minScore: 13, text: "Moderate psychological distress" },
            { minScore: 0, text: "Low psychological distress" }
        ]
    }
};
