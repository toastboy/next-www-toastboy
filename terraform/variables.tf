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

variable "tags" {
  type    = map(string)
  default = {}
}
