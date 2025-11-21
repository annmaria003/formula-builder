📘 Formula Builder — Internship Assignment

A single-page React application for defining reusable variables, creating dynamic formulas, and executing them with contextual runtime inputs.
Built using React + Vite, deployed on Vercel.

🚀 Features Overview
1. Variables Management

Manage reusable variables that can be used inside formulas.
Variable Types
Constant Variable
Fixed numeric value

Example: BASIC = 10000
Dynamic Variable
Value is computed using other variables
Supports recursive dependency resolution
Example: GROSS = BASIC + DA + HRA
Capabilities
Add, edit, delete variables
Color-coded type badges
Validation to prevent duplicate names
All variables follow uppercase naming convention

3. Formula Builder

Create formulas using static variables + runtime contextual inputs.
Formula Syntax
Use defined variables normally
Contextual inputs use:
{{#variable_name}}

Example:
MONTHLY_SALARY = (GROSS / 30) * {{#num_of_days}}

Execution Flow

Detect contextual placeholders
Prompt user for runtime inputs
Resolve dynamic variables recursively
Substitute constants
Evaluate using correct mathematical precedence (PEMDAS)
Display result or error
UI Features
Formula cards
Execute button
Delete button
Expression preview

Mathematical Evaluation Supports:
+ Addition
- Subtraction
* Multiplication
/ Division
( ) Parentheses
Follows full PEMDAS precedence rules.

Validations Include:
Invalid characters
Undefined variables
Circular dependencies
Missing contextual inputs

📊 Example Data
Variables
BASIC = 10000 (Constant)
DA = 2000 (Constant)
HRA = 3000 (Constant)
GROSS = BASIC + DA + HRA (Dynamic)
PF = 1200 (Constant)
TAX = 500 (Constant)
DEDUCTIONS = PF + TAX (Dynamic)

Formulas
NET_SALARY = GROSS - DEDUCTIONS
MONTHLY_SALARY = (GROSS / 30) * {{#num_of_days}}
BONUS = GROSS * {{#bonus_percentage}} / 100

🛠️ Tech Stack

React
Vite
JavaScript
CSS

Vercel Deployment
📦 Local Development
npm install
npm run dev

🌐 Live Demo

Hosted on Vercel:
👉https://formula-builder-steel.vercel.app/

📂 GitHub Repository
👉https://github.com/annmaria003/formula-builder

📝 Notes

Code follows clean, modular structure
Utility functions handle expression parsing, variable resolution, and contextual extraction
No external formula libraries — everything implemented manually
