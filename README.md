# Vitae - ESG Assessment Platform

A comprehensive **Human Rights Due Diligence Assessment** platform built with
Remix, React, and SurveyJS. This application enables organizations to conduct
structured ESG (mainly Social) evaluations with real-time persistence,
hierarchical question organization, and reporting capabilities.

## Key Features

- **Real-time Assessment Completion** with automatic answer persistence
- **Hierarchical Question Structure** supporting umbrella questions and
  sub-questions
- **Excel-based Question Management** with automated TypeScript generation
- **Accordion Help System** (Help, Reporting, Documentation)
- **Progress Tracking** with section-based navigation
- **Markdown Support** in question titles and help content
- **Mobile-Responsive Design** optimized for all devices

---

## Import Instructions

### Prerequisites

- Node.js 22+
- npm or yarn package manager
- Excel file with standardized question structure

### Setup Steps

```bash
# Clone the repository
git clone <repository-url>
cd vitae

# Install dependencies
npm install

# Set up the database
npm run setup

# Start development server
npm run dev
```

### Excel Import Process

1. Place your assessment questions Excel file at
   `data/uploads/assessment-questions.xlsx`
2. Run the import command: `npm run import-questions`
3. Questions are automatically converted to TypeScript and integrated into the
   application

### Excel Demo Import Process

1. Place your assessment questions Excel file at
   `data/uploads/demo-assessment-questions.xlsx`
2. Run the import command: `npm run import-demo-questions`
3. Questions are automatically converted to TypeScript and integrated into the
   application

---

## Excel Structure

The assessment questions are imported from a standardized Excel format with the
following columns:

### Required Columns

| Column       | Description                          | Type    | Example                                         |
| ------------ | ------------------------------------ | ------- | ----------------------------------------------- |
| `questionId` | Unique identifier for the question   | String  | `env-001`, `soc-015`                            |
| `name`       | Field name for forms (snake_case)    | String  | `energy_source`, `water_usage`                  |
| `type`       | Question type                        | Enum    | `radiogroup`, `text`, `group`                   |
| `title`      | Question text displayed to users     | String  | `What is your primary **energy source**?`       |
| `section`    | Category grouping                    | String  | `Environmental Impact`, `Social Responsibility` |
| `isRequired` | Boolean flag for mandatory questions | Boolean | `TRUE`, `FALSE`                                 |
| `score`      | Point weight for assessment          | Number  | `10`, `5`, `0`                                  |

### Optional Columns

| Column             | Description                                      | Type    | Example                                        |
| ------------------ | ------------------------------------------------ | ------- | ---------------------------------------------- |
| `help`             | Contextual guidance content                      | String  | `Consider renewable vs non-renewable sources`  |
| `reporting`        | Compliance reporting information                 | String  | `Report monthly usage to environmental agency` |
| `docs`             | Additional documentation                         | String  | `See water management guidelines document`     |
| `ignore`           | Skip import flag                                 | Boolean | `TRUE`, `FALSE`                                |
| `parentQuestionId` | Reference to umbrella question (with type group) | String  | `env-umbrella-001`                             |

### Question Types

- **`radiogroup`**: Single choice selection with predefined options
- **`text`**: Open-ended text responses
- **`group`**: Umbrella questions for organizational hierarchy (no input)

### Default Choices

For `radiogroup` questions without specified choices, the system applies:

- `Non adottato` (Not adopted)
- `Parzialmente adottato` (Partially adopted)
- `Totalmente adottato` (Fully adopted)
- `Non applicabile` (Not applicable)

---

## Question Grouping System

### Umbrella Questions

The platform supports hierarchical question organization through umbrella
questions:

```excel
questionId: env-umbrella-001
type: group
title: Environmental Impact Assessment Overview
parentQuestionId: [empty]
```

### Sub-Questions

Regular questions can reference umbrella questions:

```excel
questionId: env-002
type: radiogroup
title: How do you assess water usage?
parentQuestionId: env-umbrella-001
```

### Benefits

- **Visual Hierarchy**: Clear parent-child relationships in the UI
- **Better Navigation**: Grouped questions improve user experience
- **Progress Tracking**: Umbrella questions excluded from completion
  calculations
- **Structured Reporting**: Organized results by logical groupings

---

## Accordion Columns System

Each question can display up to three contextual help sections in an expandable
accordion format:

### Help Column

- **Purpose**: Contextual guidance for question understanding
- **Content**: Explanations, examples, clarifications
- **Icon**: Question mark circle
- **Example**: _"Consider irrigation systems and water recycling methods"_

### Reporting Column

- **Purpose**: Compliance and regulatory requirements
- **Content**: Mandatory reporting obligations, standards
- **Icon**: Pencil (reporting)
- **Example**: _"Monthly water usage must be reported to the environmental
  agency"_

### Documentation Column

- **Purpose**: Additional resources and references
- **Content**: Links to guidelines, policies, frameworks
- **Icon**: Pencil (documentation)
- **Example**: _"See ISO 14001 water management guidelines in company handbook"_

### Dynamic Display

- Accordions only appear when content is available
- Users can expand relevant sections on demand
- Mobile-optimized with touch-friendly interactions
- Support for markdown formatting in all content

---

## Markdown Syntax and Examples

The platform supports GitHub-flavored markdown in question titles and help
content:

### Basic Formatting

```markdown
**Bold text** for emphasis _Italic text_ for subtle emphasis  
`Code snippets` for technical terms
```

### Links

```markdown
[Link text](https://example.com) for external resources
```

### Lists

```markdown
- Bullet point 1
- Bullet point 2

1. Numbered item 1
2. Numbered item 2
```

### Question Title Examples

```markdown
How do you assess your vineyard's **water usage**? Does your company have a
_formal_ environmental policy? Please describe your `carbon footprint`
calculation method.
```

### Help Content Examples

```markdown
**Consider the following factors:**

- Direct water consumption
- Irrigation efficiency
- Water recycling systems

See the [Water Management Guidelines](https://company.com/docs) for detailed
requirements.
```

---

## Technical Architecture

### Frontend Stack

- **Remix** - Full-stack React framework
- **React 19** - UI components and state management
- **SurveyJS** - Survey rendering and interaction
- **TypeScript** - Type safety and development experience
- **Tailwind CSS** - Utility-first styling

### Backend Stack

- **Prisma ORM** - Database management and queries
- **SQLite** - Data persistence
- **Node.js** - Server runtime

### Key Components

- `SurveyComponent` - Core survey rendering with real-time persistence
- `AssessmentNavigation` - Section-based progress tracking
- `QuestionAccordion` - Three-column help system
- `ResponsiveProgressBar` - Mobile-optimized progress indication

### Development Tools

- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Vitest** - Unit testing framework
- **Playwright** - End-to-end testing

---

## Mobile Optimization

- **Touch-First Design**: Optimized for mobile interaction
- **Responsive Layouts**: Adapts to all screen sizes
- **Progressive Enhancement**: Works without JavaScript
- **Fast Loading**: Lazy-loaded components and code splitting

---

## Security Features

- **User Authentication**: Secure login and session management
- **Data Validation**: Server-side input validation and sanitization
- **XSS Protection**: Safe markdown rendering
- **CSRF Protection**: Built-in request verification
- **Secure Headers**: Comprehensive security header configuration

---

## Getting Started

1. **Import your questions** using the Excel template
2. **Configure sections** and question hierarchy
3. **Customize styling** with Tailwind CSS
4. **Deploy** using your preferred hosting platform
5. **Monitor** assessment completion and analytics

For detailed development instructions, see the
[Development Guide](./docs/development.md).

---

## License

This project is licensed under the Copyright of Weco
