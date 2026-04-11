output "auth_client_id" {
  description = "Auth app registration client ID (use for AUTH_MICROSOFT_CLIENT_ID)"
  value       = azuread_application.auth.client_id
}

output "auth_client_secret" {
  description = "Auth app registration client secret (use for AUTH_MICROSOFT_CLIENT_SECRET)"
  value       = azuread_service_principal_password.auth.value
  sensitive   = true
}

output "storage_client_id" {
  description = "Storage app registration client ID (use for STORAGE_CLIENT_ID)"
  value       = azuread_application.storage.client_id
}

output "storage_client_secret" {
  description = "Storage app registration client secret (use for STORAGE_CLIENT_SECRET)"
  value       = azuread_service_principal_password.storage.value
  sensitive   = true
}

output "mail_client_id" {
  description = "Mail app registration client ID (use for MAIL_GRAPH_CLIENT_ID)"
  value       = azuread_application.mail.client_id
}

output "mail_client_secret" {
  description = "Mail app registration client secret (use for MAIL_GRAPH_CLIENT_SECRET)"
  value       = azuread_service_principal_password.mail.value
  sensitive   = true
}

