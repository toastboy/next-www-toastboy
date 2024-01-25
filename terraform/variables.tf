variable "location" {
  type    = string
  default = "uksouth"
}

variable "resource_group_name" {
  type    = string
  default = "RG-NEXT-WWW-TOASTBOY"
}

variable "tags" {
  type    = map(string)
  default = {}
}
