# Branching workflow

This repo uses a simple two-branch model:

- **`main`** — always deployable. This is the only branch connected to the
  Azure Web App's Deployment Center, so every merge into `main` triggers a
  production deploy.
- **`develop`** — integration branch. New work lands here first via pull
  request, gets tested locally, and is later merged up into `main` when it's
  ready to go live.
- **`feature/<short-description>`** — one branch per piece of work, created
  off `develop`. Opened as a pull request back into `develop`, and deleted
  once merged.

## Day-to-day flow

1. `git checkout develop && git pull`
2. `git checkout -b feature/my-change`
3. Make changes, commit, push: `git push -u origin feature/my-change`
4. Open a pull request into `develop`. The CI workflow
   (`.github/workflows/ci.yml`) runs automatically and must pass before the
   PR can be merged.
5. Merge the PR (squash or merge commit, either is fine for this project),
   then delete the feature branch.
6. When `develop` is stable and ready to ship, open a pull request from
   `develop` into `main`. CI runs again; once it passes and the PR is
   merged, Azure deploys automatically.

Both `main` and `develop` are protected: no direct pushes, and the CI check
must pass before a PR can be merged.
