import { context } from "@actions/github"
import { setFailed } from "@actions/core"
import { coreLog, getClient, getMessage, reproductionLabel } from "./utils"

async function main() {
  try {
    const {
      repo,
      payload: {
        issue,
        pull_request: pullRequest,
        label: { name: newLabel }
      }
    } = context

    if (pullRequest || !issue?.body) return coreLog("Not an issue or has no body.")
    if (newLabel !== reproductionLabel) return coreLog(`Issue was labeled \`${newLabel}\`.`)
    const client = getClient()
    const issueCommon = { ...repo, issue_number: issue.number }
    await client.issues.createComment({ ...issueCommon, body: getMessage() })
    return coreLog(`Commented on issue ${issue.number} because it has the label \`${reproductionLabel}\`.`)
  }
  catch (error) {
    setFailed(error instanceof Error ? error.message : "Unknown error")
  }
}

main()
