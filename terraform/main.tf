data "azurerm_client_config" "current" {}

resource "azurerm_resource_group" "next_www_toastboy" {
  name     = var.resource_group_name
  location = var.location

  tags = var.tags
}

resource "azuread_application" "next_www_toastboy" {
  display_name = "Next www toastboy"
}

resource "azuread_service_principal" "next_www_toastboy" {
  client_id                    = azuread_application.next_www_toastboy.client_id
  app_role_assignment_required = false
}

resource "azuread_service_principal_password" "next_www_toastboy" {
  service_principal_id = azuread_service_principal.next_www_toastboy.id
  end_date_relative    = "8760h" # 1 year in hours
}

data "azuread_user" "toastboy" {
  user_principal_name = "toastboy@toastboy.co.uk"
}

resource "azurerm_storage_account" "next_www_toastboy" {
  name                     = var.storage_account_name
  resource_group_name      = azurerm_resource_group.next_www_toastboy.name
  location                 = azurerm_resource_group.next_www_toastboy.location
  account_tier             = "Standard"
  account_replication_type = "GRS"
  min_tls_version          = "TLS1_2"

  blob_properties {
    versioning_enabled = true
    delete_retention_policy {
      days = 30
    }
  }

  tags = var.tags
}

# Storage container for database seed JSON files: only my own identity and the
# app's should have any access

resource "azurerm_storage_container" "db_seed" {
  name                  = var.db_seed_container
  storage_account_name  = azurerm_storage_account.next_www_toastboy.name
  container_access_type = "private"
}

resource "azurerm_role_assignment" "toastboy" {
  scope                = azurerm_storage_account.next_www_toastboy.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = data.azuread_user.toastboy.object_id
}

resource "azurerm_role_assignment" "next_www_toastboy" {
  scope                = azurerm_storage_account.next_www_toastboy.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = azuread_service_principal.next_www_toastboy.object_id
}

# Storage for our public-accessible images

resource "azurerm_storage_container" "mugshots" {
  name                  = var.mugshots_container
  storage_account_name  = azurerm_storage_account.next_www_toastboy.name
  container_access_type = "private"
}

resource "azurerm_storage_container" "clubs" {
  name                  = var.clubs_container
  storage_account_name  = azurerm_storage_account.next_www_toastboy.name
  container_access_type = "private"
}

resource "azurerm_storage_container" "countries" {
  name                  = var.countries_container
  storage_account_name  = azurerm_storage_account.next_www_toastboy.name
  container_access_type = "private"
}

# Key vault to store the deployment secrets

resource "azurerm_key_vault" "next_www_toastboy" {
  name                     = "next-www-toastboy"
  location                 = azurerm_resource_group.next_www_toastboy.location
  resource_group_name      = azurerm_resource_group.next_www_toastboy.name
  tenant_id                = data.azurerm_client_config.current.tenant_id
  sku_name                 = "standard"
  purge_protection_enabled = true

  # Terraform itself needs to manage the secrets in the vault
  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id

    secret_permissions = [
      "List",
      "Set",
      "Get",
      "Delete",
      "Purge",
      "Recover"
    ]
  }

  # I want my identity to have access interactively
  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azuread_user.toastboy.object_id

    secret_permissions = [
      "List",
      "Set",
      "Get",
      "Delete",
      "Purge",
      "Recover"
    ]
  }

  tags = var.tags
}

resource "azurerm_key_vault_secret" "client_id" {
  name            = "client-id"
  value           = azuread_service_principal_password.next_www_toastboy.service_principal_id
  key_vault_id    = azurerm_key_vault.next_www_toastboy.id
  expiration_date = timeadd(formatdate("YYYY-MM-DD'T'HH:mm:ssZ", timestamp()), "2160h") # 90 days
}

resource "azurerm_key_vault_secret" "client_secret" {
  name            = "client-secret"
  value           = azuread_service_principal_password.next_www_toastboy.value
  key_vault_id    = azurerm_key_vault.next_www_toastboy.id
  expiration_date = timeadd(formatdate("YYYY-MM-DD'T'HH:mm:ssZ", timestamp()), "2160h") # 90 days
}

resource "random_password" "postgresql_admin_password" {
  length           = 32
  special          = true
  upper            = true
  lower            = true
  numeric          = true
  override_special = "_%@"
}

resource "azurerm_key_vault_secret" "postgresql_admin_password" {
  name            = "postgresql-admin-password"
  value           = random_password.postgresql_admin_password.result
  key_vault_id    = azurerm_key_vault.next_www_toastboy.id
  expiration_date = timeadd(formatdate("YYYY-MM-DD'T'HH:mm:ssZ", timestamp()), "2160h") # 90 days
}

resource "azurerm_postgresql_server" "next_www_toastboy" {
  name                    = var.postgresql_server_name
  location                = azurerm_resource_group.next_www_toastboy.location
  resource_group_name     = azurerm_resource_group.next_www_toastboy.name
  sku_name                = "GP_Gen5_2"
  storage_mb              = 5120
  version                 = "11"
  ssl_enforcement_enabled = true

  administrator_login          = "toastboy"
  administrator_login_password = azurerm_key_vault_secret.postgresql_admin_password.value

  tags = var.tags
}

resource "azurerm_postgresql_database" "next_www_toastboy" {
  name                = var.postgresql_database_name
  resource_group_name = azurerm_resource_group.next_www_toastboy.name
  server_name         = azurerm_postgresql_server.next_www_toastboy.name
  charset             = "UTF8"
  collation           = "English_United States.1252"
}
