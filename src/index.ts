import * as github from "@actions/github"
import * as core from "@actions/core"
import { coreLog, getMessage, reproductionLabel } from "./utils"

async function main() {
  try {
    const {
      repo,
      payload: {
        issue,
        pull_request: pullRequest,
        label: { name: newLabel }
      }
    } = github.context

    if (pullRequest || !issue?.body || !process.env.GITHUB_TOKEN) return

    const labels = issue.labels.map((l: any) => l.name) as string[]

    if (![reproductionLabel].includes(newLabel) && !labels.includes(reproductionLabel))
      return coreLog("Not manually labeled or already labeled.")

    const client = github.getOctokit(process.env.GITHUB_TOKEN).rest
    const issueCommon = { ...repo, issue_number: issue.number }

    if (newLabel === reproductionLabel) {
      await client.issues.createComment({ ...issueCommon, body: getMessage() })
      return coreLog("Commented on issue, because it did not have a sufficient reproduction.")
    }
  }
  catch (error) {
    core.setFailed(error instanceof Error ? error.message : "Unknown error")
  }
}

main()
