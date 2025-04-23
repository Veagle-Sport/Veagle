Here's how you can structure and improve the information into a well-organized `README.md` file for your GitHub repository:

```markdown
# Veagle Project

This is the backend of the Veagle project.

## Setup Instructions

Follow these steps to get the project up and running locally:

### 1. Clone the Repository
Clone the repository to your local machine using the following command:

```bash
git clone <repository-url>
```

### 2. Add the `.env` File
In the root directory of the project, create a `.env` file. This file should contain the necessary environment variables. You can check with the team or project documentation for the specific values required.

### 3. Install Dependencies
Navigate to the project directory and install the required dependencies with `pnpm`:

```bash
pnpm install
```

### 4. Create and Switch to a New Branch
Create a new branch to work on by running:

```bash
git switch -c <your-branch-name>
```

### 5. Run the Development Server
Start the development server by running:

```bash
pnpm run start:dev
```

