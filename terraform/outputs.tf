output "client_id" {
  value     = azuread_service_principal_password.next_www_toastboy_db_seed.service_principal_id
  sensitive = true
}

output "client_secret" {
  value     = azuread_service_principal_password.next_www_toastboy_db_seed.value
  sensitive = true
}
