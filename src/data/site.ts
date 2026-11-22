import type { Category, Experience, Profile, Project, Skill, SkillCategory } from '../types/content';

// Static site data. Edit this file directly to change it; blog articles and prompts live in /content
// and are managed through Decap CMS at /admin.

export const profile: Profile = {
  name: 'Jay Rathod',
  positioning: 'QA Engineer & Automation Professional',
  heroTitle: 'I Turn Testing Into Quality Engineering.',
  heroSubtitle:
    'QA professional with 6 years of experience across manual testing, web and mobile applications, automation testing, and API validation. Exploring smarter ways to improve software quality through automation and AI.',
  shortIntro:
    'I started my career in manual testing and grew into automation and quality engineering. Today I focus on Playwright with TypeScript, API testing, and practical ways AI can make QA teams faster and sharper.',
  about: `I began my career as a manual tester, working hands-on with web applications, mobile applications and early API checks. Those first two years taught me the fundamentals that still shape how I work: functional and regression testing, reading requirements closely, and thinking about how real users will actually break a product.

Over the next two years my focus moved to web application testing and automation. I built automation with **Cypress**, worked with **Selenium**, and learned how a good automation suite changes the speed and confidence of a release.

Today I work with **Playwright and TypeScript**, test APIs with **Postman** and **Swagger**, manage work in **Jira**, and explore how **AI-assisted testing** can improve QA productivity: generating test ideas, triaging failures and reviewing coverage.

What connects all of it is a simple belief: testing is not a phase at the end of development. It is a way of understanding the product and protecting the people who use it.`,
  philosophy:
    'Testing is not just about executing test cases. It is about understanding the product, identifying risks, challenging assumptions, and ensuring software quality.',
  yearsOfExperience: 6,
  journey: [
    {
      id: 'stage_1',
      period: 'Years 1–2',
      title: 'Manual testing foundations',
      description: 'Manual testing of web and mobile applications, basic API testing, and functional and regression testing.',
    },
    {
      id: 'stage_2',
      period: 'Years 3–4',
      title: 'Web testing & automation',
      description: 'Primarily web application testing, building Cypress automation, and working with Selenium and automation practices.',
    },
    {
      id: 'stage_3',
      period: 'Now',
      title: 'Quality engineering & AI-assisted QA',
      description: 'Playwright with TypeScript, API testing with Postman and Swagger, test strategy, and AI-powered QA workflows.',
    },
  ],
  interests: [
    'Playwright with TypeScript',
    'Cypress',
    'Selenium',
    'API testing with Postman & Swagger',
    'AI-assisted software testing',
    'AI-powered QA workflows',
    'Test strategy & quality engineering',
  ],
  goals: [
    'Grow from test execution into quality engineering and test strategy.',
    'Build practical, maintainable automation with Playwright and TypeScript.',
    'Explore how AI can make QA workflows smarter and more productive.',
    'Share practical QA knowledge with the community through QA UNPACKED.',
  ],
  // Put a photo in public/images/ and set e.g. '/images/jay-rathod.jpg'.
  avatarUrl: null,
  location: 'Ahmedabad, Gujarat, India',
  email: 'jayrathod3210@gmail.com',
  // Left empty on purpose: anything here is shown publicly.
  phone: '',
  resumeUrl: '',
  socials: [
    { id: 'social_linkedin', platform: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/jay-rathod-456198146' },
    { id: 'social_github', platform: 'github', label: 'GitHub', url: '' },
  ],
  qaUnpacked: {
    name: 'QA UNPACKED',
    tagline: 'Explore. Learn. Build.',
    description:
      'A knowledge-sharing initiative about practical software quality: testing concepts, automation, AI in QA, honest industry opinions, and conversations with the QA community.',
    focusAreas: [
      'Practical QA knowledge',
      'Testing concepts',
      'Software quality discussions',
      'Automation',
      'AI in QA',
      'Industry opinions',
      'Community engagement',
    ],
    // Empty URLs render as "coming soon".
    socials: [
      { id: 'qa_linkedin', platform: 'linkedin', label: 'LinkedIn', url: '' },
      { id: 'qa_instagram', platform: 'instagram', label: 'Instagram', url: '' },
    ],
  },
};

export const experiences: Experience[] = [
  {
    id: 'exp_citrusbug_lead',
    company: 'Citrusbug',
    role: 'QA Lead',
    startDate: '2025-12',
    endDate: null,
    location: '',
    summary: 'End-to-end QA ownership across concurrent client projects, leading a team of QA engineers.',
    responsibilities: [
      'Own end-to-end QA delivery across 10–15 concurrent client projects, from requirement intake through release sign-off.',
      'Act as primary QA point of contact for clients: leading kickoff calls, aligning on test strategy, and maintaining transparent status visibility.',
      'Lead and manage a team of 5+ QA engineers: assigning work, reviewing test cases, mentoring, and monitoring daily progress.',
      'Drive hiring for the QA function: technical interviews, onboarding, and hands-on training for new team members.',
      'Partner with Product Managers and development leads on requirement clarification, sprint planning, and delivery risk resolution.',
    ],
    contributions: [
      'Championed AI-augmented testing practices across the team, including AI-assisted test case generation with LLM tools (Claude, ChatGPT) and AI-driven failure triage.',
    ],
    technologies: ['Playwright', 'TypeScript', 'Claude', 'ChatGPT'],
    order: 1,
  },
  {
    id: 'exp_citrusbug_ae',
    company: 'Citrusbug',
    role: 'Automation Engineer',
    startDate: '2024-12',
    endDate: '2025-12',
    location: '',
    summary: 'Designed and built a hybrid Playwright + TypeScript automation framework and CI/CD integration.',
    responsibilities: [
      'Built dedicated smoke suites for rapid pre-production and post-production validation.',
      'Integrated CI/CD pipelines via GitHub Actions and Azure DevOps, triggered on pull request and staging merges.',
      'Set up HTML/JSON test reporting with automated email and Discord notifications.',
      'Conducted performance and load testing using Locust.',
    ],
    contributions: [
      'Designed and built a hybrid automation framework from scratch (Page Object Model + data-driven + AI-assisted layer) using Playwright and TypeScript, scaling to 300+ automated test cases across chatbot, CRM, and project management applications.',
      'Reduced regression execution effort by ~80% through framework optimization and AI-assisted self-healing locators.',
      'Introduced AI-based test case generation from requirements and user stories, and AI-driven visual/UI regression testing across browsers and devices.',
    ],
    technologies: ['Playwright', 'TypeScript', 'GitHub Actions', 'Azure DevOps', 'Locust', 'Claude', 'ChatGPT'],
    order: 2,
  },
  {
    id: 'exp_tatvasoft',
    company: 'Tatvasoft',
    role: 'Software QA Engineer',
    startDate: '2023-04',
    endDate: '2024-11',
    location: '',
    summary: 'Web application testing and Cypress automation.',
    responsibilities: [
      'Partnered with developers and product owners to clarify requirements.',
      'Used TestRail for structured test case management and coverage tracking.',
    ],
    contributions: [
      'Built a Cypress automation suite for a large web application, cutting regression execution time from 8 hours to 2 hours and improving release reliability by 40%.',
    ],
    technologies: ['Cypress', 'JavaScript', 'TestRail'],
    order: 3,
  },
  {
    id: 'exp_iottive',
    company: 'IOTTIVE Pvt. Ltd.',
    role: 'QA Engineer',
    startDate: '2021-04',
    endDate: '2023-02',
    location: '',
    summary: 'Manual functional, smoke, regression, and compatibility testing.',
    responsibilities: [
      'Executed functional, smoke, regression, and compatibility testing across web platforms.',
      'Triaged defects with development teams to improve release quality.',
      'Investigated customer-reported issues through root-cause analysis and documented findings for cross-functional resolution.',
    ],
    contributions: [],
    technologies: [],
    order: 4,
  },
];

export const skillCategories: SkillCategory[] = [
  { id: 'sc_testing', name: 'Software Testing', description: 'Core testing practice across web and mobile.', order: 1 },
  { id: 'sc_automation', name: 'Automation', description: 'Frameworks and languages for automated testing.', order: 2 },
  { id: 'sc_api', name: 'API Testing', description: 'Validating services beyond the UI.', order: 3 },
  { id: 'sc_cicd', name: 'CI/CD & Performance', description: 'Getting tests into the delivery pipeline.', order: 4 },
  { id: 'sc_tools', name: 'Tools & Collaboration', description: 'How work is tracked, versioned and shared.', order: 5 },
  { id: 'sc_emerging', name: 'Emerging Areas', description: 'Where QA is heading next.', order: 6 },
];

const skillNames: Record<string, string[]> = {
  sc_testing: [
    'Manual Testing',
    'Functional Testing',
    'Regression Testing',
    'Exploratory Testing',
    'Smoke Testing',
    'User Acceptance Testing',
    'Web Application Testing',
    'Mobile Application Testing',
  ],
  sc_automation: ['Playwright', 'Cypress', 'Selenium', 'TypeScript', 'JavaScript', 'Page Object Model'],
  sc_api: ['Postman', 'Swagger', 'API Validation', 'Positive & Negative Testing'],
  sc_cicd: ['GitHub Actions', 'Azure DevOps', 'Locust (Load Testing)'],
  sc_tools: ['Jira', 'Azure Boards', 'TestRail', 'Git / GitHub'],
  sc_emerging: ['AI in Software Testing', 'AI-assisted Test Case Generation', 'QA Productivity', 'Automation Strategy'],
};

export const skills: Skill[] = Object.entries(skillNames).flatMap(([categoryId, names]) =>
  names.map((name, i) => ({ id: `${categoryId}_${i + 1}`, name, categoryId, order: i + 1 })),
);

export const projects: Project[] = [
  {
    id: 'proj_sample_framework',
    slug: 'sample-e2e-automation-framework',
    title: 'Sample: End-to-End Automation Framework',
    summary:
      'Placeholder project. Replace this with a real automation framework you built: what it tests, how it is structured, and what changed because of it.',
    businessContext: '[Describe the product and why automation mattered to the business: release frequency, regression pain, team size.]',
    testingApproach:
      '[Explain the framework design: e.g. Page Object Model, data-driven tests, fixtures, test tagging, how smoke and regression suites are split.]',
    technologies: ['Playwright', 'TypeScript'],
    responsibilities: ['[Your role on this project]', '[What you designed, built or owned]'],
    challenges: ['[A real challenge: flaky tests, unstable locators, test data, environments]'],
    outcomes: ['[A verified, measurable outcome you can stand behind]'],
    images: [],
    githubUrl: '',
    liveUrl: '',
    isSample: true,
    featured: true,
    order: 1,
  },
  {
    id: 'proj_sample_api',
    slug: 'sample-api-test-suite',
    title: 'Sample: API Test Suite',
    summary:
      'Placeholder project. Use this slot for an API testing project: endpoints covered, validation strategy, and how it caught issues early.',
    businessContext: '[What service or product the API powers, and the risk of it breaking.]',
    testingApproach: '[Positive and negative scenarios, schema validation, auth checks, boundary values, environments and test data.]',
    technologies: ['Postman', 'Swagger'],
    responsibilities: ['[Your responsibilities]'],
    challenges: ['[A real challenge you solved]'],
    outcomes: ['[A real outcome]'],
    images: [],
    githubUrl: '',
    liveUrl: '',
    isSample: true,
    featured: true,
    order: 2,
  },
  {
    id: 'proj_sample_ai',
    slug: 'sample-ai-assisted-qa-workflow',
    title: 'Sample: AI-Assisted QA Workflow',
    summary:
      'Placeholder project. Describe a workflow where AI tools improved QA work, such as test case generation, failure triage or coverage review.',
    businessContext: '[Which team or process this improved, and why it was needed.]',
    testingApproach: '[Which AI tools, where humans stay in the loop, and how output quality was reviewed.]',
    technologies: ['AI-assisted testing'],
    responsibilities: ['[Your responsibilities]'],
    challenges: ['[A real challenge you solved]'],
    outcomes: ['[A real outcome]'],
    images: [],
    githubUrl: '',
    liveUrl: '',
    isSample: true,
    featured: false,
    order: 3,
  },
];

// Keep these ids in sync with the category options in public/admin/config.yml (a unit test checks this).
export const blogCategories: Category[] = [
  { id: 'software-testing', name: 'Software Testing', description: 'Fundamentals and practice of testing software.' },
  { id: 'manual-testing', name: 'Manual Testing', description: 'Exploratory, functional and human-driven testing.' },
  { id: 'automation-testing', name: 'Automation Testing', description: 'Building and maintaining automated test suites.' },
  { id: 'api-testing', name: 'API Testing', description: 'Testing services, contracts and integrations.' },
  { id: 'playwright', name: 'Playwright', description: 'Playwright tips, patterns and experiences.' },
  { id: 'cypress', name: 'Cypress', description: 'Cypress tips, patterns and experiences.' },
  { id: 'selenium', name: 'Selenium', description: 'Selenium tips, patterns and experiences.' },
  { id: 'ai-in-qa', name: 'AI in QA', description: 'How AI is changing quality engineering.' },
  { id: 'test-strategy', name: 'Test Strategy', description: 'Planning what to test, and why.' },
  { id: 'software-quality', name: 'Software Quality', description: 'Quality beyond testing.' },
  { id: 'qa-career', name: 'QA Career', description: 'Growing a career in software testing.' },
];

export const promptCategories: Category[] = [
  { id: 'test-case-generation', name: 'Test Case Generation', description: '' },
  { id: 'manual-testing', name: 'Manual Testing', description: '' },
  { id: 'api-testing', name: 'API Testing', description: '' },
  { id: 'automation-testing', name: 'Automation Testing', description: '' },
  { id: 'playwright', name: 'Playwright', description: '' },
  { id: 'cypress', name: 'Cypress', description: '' },
  { id: 'bug-analysis', name: 'Bug Analysis', description: '' },
  { id: 'test-data-generation', name: 'Test Data Generation', description: '' },
  { id: 'test-documentation', name: 'Test Documentation', description: '' },
  { id: 'ai-in-qa', name: 'AI in QA', description: '' },
];
