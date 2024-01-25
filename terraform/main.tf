resource "azurerm_resource_group" "this" {
  name     = var.resource_group_name
  location = var.location

  tags = var.tags
}

data "azurerm_client_config" "current" {}

resource "azuread_application" "next_www_toastboy_db_seed" {
  display_name = "Next www toastboy db seed"
}

resource "azuread_service_principal" "next_www_toastboy_db_seed" {
  client_id                    = azuread_application.next_www_toastboy_db_seed.client_id
  app_role_assignment_required = false
}

resource "random_password" "password" {
  length  = 16
  special = true
}

resource "azuread_service_principal_password" "next_www_toastboy_db_seed" {
  service_principal_id = azuread_service_principal.next_www_toastboy_db_seed.id
  end_date_relative    = "8760h" # 1 year in hours
}

module "db-seed" {
  source = "./modules/azure-blob-storage"

  location                    = var.location
  resource_group_name         = azurerm_resource_group.this.name
  container_name              = "dbseeddata"
  service_principal_object_id = azuread_service_principal.next_www_toastboy_db_seed.object_id

  tags = var.tags
}

resource "azurerm_key_vault" "next_www_toastboy" {
  name                = "next-www-toastboy"
  location            = azurerm_resource_group.this.location
  resource_group_name = azurerm_resource_group.this.name
  tenant_id           = data.azurerm_client_config.current.tenant_id
  sku_name            = "standard"

  soft_delete_retention_days = 7
  purge_protection_enabled   = false

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id

    secret_permissions = [
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
  name         = "client-id"
  value        = azuread_service_principal_password.next_www_toastboy_db_seed.service_principal_id
  key_vault_id = azurerm_key_vault.next_www_toastboy.id
}

resource "azurerm_key_vault_secret" "client_secret" {
  name         = "client-secret"
  value        = azuread_service_principal_password.next_www_toastboy_db_seed.value
  key_vault_id = azurerm_key_vault.next_www_toastboy.id
}
