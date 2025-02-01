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

variable "tags" {
  type = map(string)
  default = {
    environment = "dev"
    project     = "next-www-toastboy"
    provisioner = "terraform"
  }
}
