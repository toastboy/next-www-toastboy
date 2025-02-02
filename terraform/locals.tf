locals {
  tags = merge(
    var.tags,
    {
      Commit      = format("%s/%s/commit/%s", var.github_server_url, var.github_repository, var.github_sha)
      Repository  = var.github_repository
      WorkflowRun = format("%s/%s/actions/runs/%s", var.github_server_url, var.github_repository, var.github_run_id)
    },
  )
}
