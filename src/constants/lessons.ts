export const LEVELS = [
    { id: 1, name: "Beginner", description: "Learn the home row and basic finger placement.", color: "text-blue-400" },
    { id: 2, name: "Intermediate", description: "Master capitalization, numbers, and common words.", color: "text-green-400" },
    { id: 3, name: "Advanced", description: "Build speed with complex sentences and symbols.", color: "text-secondary" },
    { id: 4, name: "Expert", description: "Professional documents and competitive speed tests.", color: "text-primary" },
];

export const MOCK_LESSONS = (lvl: number, order: number) => ({
    _id: `mock-${lvl}-${order}`,
    level: lvl,
    order: order,
    title: `Level ${lvl} - Lesson ${order}`,
    targetWPM: 15 + (lvl * 15) + (order * 2),
    estimatedMinutes: 2 + Math.floor(order / 3),
    type: "practice"
});
