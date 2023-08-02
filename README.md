# Reproduire

GitHub action that adds a custom message to incomplete issues.
This action is intended to be in repositories where contributors needs to submit issues with a reproduction.
It enables an automated message to be added to issues that are missing a reproduction, based on a defined label.

## Add a message when an issue is flagged as incomplete

Setup the Reproduire action with a workflow file in your repository (e.g. `.github/workflows/reproduire.yml`) :

```yaml
name: Reproduire
on:
  issues:
    types: [labeled]

permissions:
  issues: write

jobs:
  inspect:
    runs-on: ubuntu-latest
    steps:
      - uses: Hebilicious/reproduire@v1
        with:
          label: needs-reproduction # Optional, will default to this value.
```

You can create a custom markdown message by creating a `.github/reproduire/needs-reproduction.md` in your repository.

## Automatically close incomplete issues

You can use another action to automatically close labeled issues after a certain amount of time.
Setup a [stale](https://github.com/actions/stale) action in your repository (e.g. `.github/workflows/reproduire-close.yml`) :

```yaml
name: Close incomplete issues
on:
  schedule:
    - cron: '30 1 * * *' # run every day

permissions:
  issues: write

jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/stale@v8
        with:
          days-before-stale: -1 # Issues and PR will never be flagged stale automatically.
          stale-issue-label: needs-reproduction # Label that flags an issue as stale.
          days-before-issue-close: 7
          stale-issue-message: Action stale will close this issue in 7 days.
          close-issue-message: This issue was closed because it was open for 7 days without a valid reproduction.
          close-issue-label: closed-by-reproduire
```
