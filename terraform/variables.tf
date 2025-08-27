variable "azure_tenant_id" {
  type = string
}

variable "azure_subscription_id" {
  type = string
}

variable "azure_client_id" {
  type = string
}

variable "azure_client_secret" {
  type = string
}

variable "location" {
  type    = string
  default = "uksouth"
}

variable "resource_group_name" {
  type    = string
  default = "RG-NEXT-WWW-TOASTBOY"
}

variable "storage_account_name" {
  type    = string
  default = "nextwwwtoastboy"
}

variable "db_seed_container" {
  type    = string
  default = "dbseeddata"
}

variable "mugshots_container" {
  type    = string
  default = "mugshots"
}

variable "clubs_container" {
  type    = string
  default = "clubs"
}

variable "countries_container" {
  type    = string
  default = "countries"
}

variable "github_server_url" {
  type    = string
  default = "Unset (manual run)"
}

variable "github_repository" {
  type    = string
  default = "Unset (manual run)"
}

variable "github_sha" {
  type    = string
  default = "Unset (manual run)"
}

variable "github_run_id" {
  type    = string
  default = "Unset (manual run)"
}

variable "tags" {
  type = map(string)
  default = {
    Project     = "next-www-toastboy"
    Provisioner = "terraform"
  }
}
