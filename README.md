# TypeScript Package Starter

A modern, well-configured starter template for creating TypeScript npm packages. This template provides a solid foundation with best practices and essential tooling for TypeScript package development.

[![CI](https://github.com/imgarylai/ts-package-starter/actions/workflows/test.yml/badge.svg)](https://github.com/imgarylai/ts-package-starter/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[繁體中文](README.zh-TW.md)

## Features

- 📦 Modern build setup with [tsup](https://github.com/egoist/tsup)
- 🔥 ESM and CommonJS support
- 📘 TypeScript with strict mode
- 🧪 Testing with Jest
- 📊 Code coverage reporting
- 📝 API documentation with TypeDoc
- ✨ Code formatting with Prettier
- 🚨 Linting with ESLint
- 🔄 Continuous Integration with GitHub Actions
- 📋 Conventional commits with commitlint
- 🪝 Git hooks with husky
- 🌲 Tree-shakeable exports
- 📦 Optimized npm package exports
- 🤖 Automated dependency updates with Renovate

## Requirements

- Node.js >= 22.14.0
- npm >= 10.0.0

## Getting Started

1. Use this template by clicking the "Use this template" button on GitHub
   or clone it directly:

```bash
git clone https://github.com/imgarylai/ts-package-starter.git my-package
cd my-package
```

2. Update the package information:

   - Modify `package.json` with your package name, description, author, etc.
   - Update this README.md with your package's information
   - Update the LICENSE file if needed

3. Install dependencies:

```bash
npm install
```

4. Start developing:

```bash
npm run dev
```

## Example Usage

This is an example of how your package could be used once you publish it. Update this section with your own package's usage:

```typescript
// This is just a placeholder example - replace with your own package's usage
import { YourFunction } from "your-package-name";

// Use your package
const result = YourFunction();
```

## Development

### Setup

1. Clone the repository:

```bash
git clone https://github.com/imgarylai/ts-package-starter.git
cd ts-package-starter
```

2. Install dependencies:

```bash
npm install
```

3. Start developing:

```bash
npm run dev
```

### Available Scripts

- `npm run build` - Build the package with tsup
- `npm run dev` - Watch mode for development
- `npm test` - Run tests
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Lint the code
- `npm run type-check` - Check types
- `npm run docs` - Generate documentation
- `npm run docs:watch` - Generate documentation in watch mode
- `npm run clean` - Clean build outputs
- `npm run prepare` - Install git hooks

### Project Structure

```
.
├── src/               # Source code
│   ├── index.ts      # Main entry point
│   └── index.test.ts # Tests
├── .github/          # GitHub configuration
├── .husky/           # Git hooks
├── dist/             # Built files (generated)
├── docs/             # Generated documentation
├── coverage/         # Test coverage reports
└── node_modules/     # Dependencies
```

## Development Workflow

1. Write your code in the `src` directory
2. Write tests in `*.test.ts` files
3. Run tests with `npm test`
4. Build your package with `npm run build`

## Publishing

This package uses semantic-release for automated publishing based on conventional commit messages. The process is fully automated and will:

- Determine the next version number based on commit messages
- Generate release notes
- Update the CHANGELOG.md
- Create a GitHub release
- Publish to npm

### How it Works

The release process is triggered by commits to the main branch. The version bump is determined by your commit messages:

- `fix: ...` - Patch release (1.0.0 → 1.0.1)
- `feat: ...` - Minor release (1.0.0 → 1.1.0)
- `BREAKING CHANGE: ...` in commit body - Major release (1.0.0 → 2.0.0)
- `feat!: ...` - Major release with breaking change (1.0.0 → 2.0.0)

Examples:

```bash
# Patch release
git commit -m "fix: correct network timeout issue"

# Minor release
git commit -m "feat: add new API endpoint"

# Major release
git commit -m "feat!: redesign public API
BREAKING CHANGE: The entire public API has been redesigned"
```

### Setup Requirements

To enable automated publishing, you need to:

1. Create an npm account if you don't have one
2. Create an npm access token:

   - Go to npmjs.com and log in
   - Click on your profile picture → "Access Tokens"
   - Click "Generate New Token" (select "Automation" type)
   - Copy the token

3. Add the npm token to your GitHub repository:
   - Go to your GitHub repository settings
   - Click on "Secrets and variables" → "Actions"
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Your npm access token
   - Click "Add secret"

### Development Workflow

1. Write your code and commit using conventional commit messages
2. Push to the main branch
3. semantic-release will automatically:
   - Analyze commit messages
   - Bump version
   - Generate changelog
   - Create GitHub release
   - Publish to npm

> Note: Only commits to the main branch trigger releases. When working on features, use feature branches and pull requests.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes using conventional commits (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Examples:

- `feat: add new feature`
- `fix: resolve bug issue`
- `docs: update README`
- `chore: update dependencies`

## Building

The project uses tsup for building, which provides:

- Multiple format outputs (ESM, CommonJS)
- TypeScript declaration files
- Source maps
- Tree shaking
- Minification

## Documentation

This project uses TypeDoc for generating API documentation. The documentation is automatically built and deployed to GitHub Pages on every push to the main branch.

### Local Documentation

To generate documentation locally:

```bash
# Generate documentation
npm run docs

# Watch mode for documentation
npm run docs:watch
```

The documentation will be generated in the `docs` directory.

### Online Documentation

The documentation is automatically deployed to GitHub Pages at:
[https://imgarylai.github.io/ts-package-starter](https://imgarylai.github.io/ts-package-starter)

Features of the documentation:

- Full API reference
- Type information
- Search functionality
- Version information
- Integration with README
- Examples and usage

### GitHub Pages Setup

To set up GitHub Pages for your documentation:

1. Go to your GitHub repository settings
2. Navigate to "Pages" under "Code and automation"
3. Under "Build and deployment":
   - Source: Select "GitHub Actions"
   - Branch: Leave as default (gh-pages will be created automatically)

The documentation will be automatically built and deployed when:

- You push to the main branch
- The GitHub Actions workflow completes successfully

You can also manually trigger the documentation build:

1. Go to the "Actions" tab in your repository
2. Select the "Documentation" workflow
3. Click "Run workflow"

### Documentation Configuration

The documentation is configured in `typedoc.json`. Key features:

- Excludes private and protected members
- Includes version information
- Validates links and exports
- Uses the default theme
- Integrates with the README

## Dependency Management

This project uses [Renovate](https://docs.renovatebot.com/) for automated dependency updates. The configuration includes:

- Automatic merging of minor and patch updates
- Dependencies are updated every weekend
- Updates are automatically rebased
- Non-major dependencies are grouped together
- Node.js version updates are disabled (managed manually)

The Renovate bot will automatically create pull requests for dependency updates according to this schedule and configuration. This helps keep your dependencies up-to-date while minimizing maintenance overhead.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Gary Lai - [@imgarylai](https://github.com/imgarylai)

## Acknowledgments

- [tsup](https://github.com/egoist/tsup) for the amazing build tool
- [TypeScript](https://www.typescriptlang.org/) for the type system
- [Jest](https://jestjs.io/) for testing
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io/) for code formatting
- [Husky](https://typicode.github.io/husky/) for git hooks
