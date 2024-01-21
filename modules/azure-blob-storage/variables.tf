variable "location" {
  type    = string
  default = "uksouth"
}

variable "resource_group_name" {
  type    = string
  default = "RG-WWW-STORAGE"
}

variable "storage_account_name" {
  type    = string
  default = "nextwwwtoastboy"
}

variable "container_name" {
  type = string
}

variable "tags" {
  type    = map(string)
  default = {}
}
