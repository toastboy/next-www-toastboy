variable "location" {
  type = string
}

variable "resource_group_name" {
  type = string
}

variable "storage_account_name" {
  type    = string
  default = "nextwwwtoastboy"
}

variable "container_name" {
  type = string
}

variable "toastboy_object_id" {
  type    = string
  default = "0880111d-a115-4828-b165-5469557a50d5"
}

variable "service_principal_object_id" {
  type = string
}

variable "tags" {
  type    = map(string)
  default = {}
}
