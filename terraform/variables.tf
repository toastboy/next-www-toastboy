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

variable "postgresql_server_name" {
  type    = string
  default = "nextwwwtoastboy"
}

variable "postgresql_database_name" {
  type    = string
  default = "footy"
}

variable "tags" {
  type    = map(string)
  default = {}
}
