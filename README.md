# Tic Attack Toe

## Description

A Tic Tac Toe application with a timer variant. This application includes both Zen and Battle modes and supports keybindings for a more interactive experience.

## Setup and Installation

### Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed [Node.js](https://nodejs.org/) (version 20.14.0 or above).
- You have installed [Yarn](https://yarnpkg.com/) package manager.
- You have installed [Git](https://git-scm.com/) for version control.

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/bcfield/tic-attack-toe.git
    cd tic-attack-toe
    ```

2. **Install dependencies**

    ```bash
    yarn install
    ```

## Running the Application

### Development Server

To run the application locally:

```bash
yarn start
```

This will start a development server and the application will be available at `http://127.0.0.1:5500`.

## Running Tests

### Unit Tests

Unit tests are written using Vitest.

To run the unit tests locally:

```bash
yarn test:unit
```

### End-to-End Tests

End-to-end tests are written using Playwright.

To run the end-to-end tests locally:

```bash
yarn test:e2e
```

For running the end-to-end tests in CI/CD, they will run automatically on push or pull request to the main or master branches as part of the GitHub Actions workflow.

## Setting the BASE_URL

- In playwright.config.ts, add a configuration to set BASE_URL based on the environment.
- In the GitHub Actions workflow file (.github/workflows/playwright.yml), set the BASE_URL environment variable for Playwright tests.

## CI/CD Pipeline

The project includes a GitHub Actions workflow to automate testing and deployment:

- Unit Tests: Run on every push and pull request to the main or master branches.
- End-to-End Tests: Run on every push and pull request to the main or master branches.
- Deployment: Deploys to GitHub Pages if all tests pass.

The GitHub Actions workflow configuration is in `.github/workflows/playwright.yml`.

### Manual Deployment

To manually deploy the application:

```bash
yarn deploy
```

## Project Structure

```plaintext
tic-attack-toe/
├── .github/                # GitHub Actions workflows
├── assets/                 # Stylesheets and images
├── dist/                   # Build output (generated)
├── e2e/                    # End-to-end tests
├── src/                    # Source code
├── unit/                   # Unit tests
├── .gitignore              # Git ignore file
├── .nvmrc                  # Node version
├── .yarnrc.yml             # Yarn configuration
├── history.html            # History page
├── index.html              # Index page
├── package.json            # Project configuration and dependencies
├── playwright.config.ts    # Playwright configuration
├── README.md               # Project documentation
├── tsconfig.json           # TypeScript configuration
├── vitest.config.js        # Vitest configuration
└── yarn.lock               # Yarn lock file
```

## Contact

If you have any questions, feel free to open an issue or contact the project maintainer at brett.field@gmail.com.
