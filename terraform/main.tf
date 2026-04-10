data "azurerm_client_config" "current" {}

# Look up the Microsoft Graph service principal so we can resolve permission IDs
# by name rather than hardcoding GUIDs.
data "azuread_service_principal" "msgraph" {
  client_id = "00000003-0000-0000-c000-000000000000" # Well-known Microsoft Graph app ID
}

locals {
  # Application permissions (Roles) – looked up by value name
  msgraph_mail_send_role_id = one([for r in data.azuread_service_principal.msgraph.app_roles : r.id if r.value == "Mail.Send"])

  # Delegated permissions (Scopes) – OIDC social login
  msgraph_openid_scope_id    = one([for s in data.azuread_service_principal.msgraph.oauth2_permission_scopes : s.id if s.value == "openid"])
  msgraph_profile_scope_id   = one([for s in data.azuread_service_principal.msgraph.oauth2_permission_scopes : s.id if s.value == "profile"])
  msgraph_email_scope_id     = one([for s in data.azuread_service_principal.msgraph.oauth2_permission_scopes : s.id if s.value == "email"])
  msgraph_user_read_scope_id = one([for s in data.azuread_service_principal.msgraph.oauth2_permission_scopes : s.id if s.value == "User.Read"])
}

resource "azurerm_resource_group" "next_www_toastboy" {
  name     = var.resource_group_name
  location = var.location

  tags = local.tags

  lifecycle {
    ignore_changes = [tags]
  }
}

# Auth-only app registration: Microsoft social login via Better Auth.
# Delegated OIDC scopes only — no application permissions, no blob access.
resource "azuread_application" "auth" {
  display_name = "Next www toastboy \u2013 Auth"

  required_resource_access {
    resource_app_id = data.azuread_service_principal.msgraph.client_id

    resource_access {
      id   = local.msgraph_openid_scope_id
      type = "Scope"
    }

    resource_access {
      id   = local.msgraph_profile_scope_id
      type = "Scope"
    }

    resource_access {
      id   = local.msgraph_email_scope_id
      type = "Scope"
    }

    resource_access {
      id   = local.msgraph_user_read_scope_id
      type = "Scope"
    }
  }

  web {
    redirect_uris = var.auth_redirect_uris

    implicit_grant {
      id_token_issuance_enabled = true
    }
  }
}

resource "azuread_service_principal" "auth" {
  client_id                    = azuread_application.auth.client_id
  app_role_assignment_required = false
}

resource "azuread_service_principal_password" "auth" {
  service_principal_id = azuread_service_principal.auth.id
  end_date             = formatdate("YYYY-MM-DD'T'HH:mm:ssZ", timeadd(timestamp(), "43800h")) # ~5 years

  lifecycle {
    ignore_changes = [end_date]
  }
}

# Storage-only app registration: Azure Blob Storage access via RBAC.
# No Graph permissions — credentials can only interact with storage.
resource "azuread_application" "storage" {
  display_name = "Next www toastboy \u2013 Storage"
}

resource "azuread_service_principal" "storage" {
  client_id                    = azuread_application.storage.client_id
  app_role_assignment_required = false
}

resource "azuread_service_principal_password" "storage" {
  service_principal_id = azuread_service_principal.storage.id
  end_date             = formatdate("YYYY-MM-DD'T'HH:mm:ssZ", timeadd(timestamp(), "43800h")) # ~5 years

  lifecycle {
    ignore_changes = [end_date]
  }
}

# Mail-only app registration: transactional email via Microsoft Graph API.
# Isolated so that Mail.Send (a powerful application permission allowing sending
# email as any user in the tenant) cannot be exercised by other credentials.
resource "azuread_application" "mail" {
  display_name = "Next www toastboy \u2013 Mail"

  required_resource_access {
    resource_app_id = data.azuread_service_principal.msgraph.client_id

    resource_access {
      id   = local.msgraph_mail_send_role_id
      type = "Role"
    }
  }
}

resource "azuread_service_principal" "mail" {
  client_id                    = azuread_application.mail.client_id
  app_role_assignment_required = false
}

resource "azuread_service_principal_password" "mail" {
  service_principal_id = azuread_service_principal.mail.id
  end_date             = formatdate("YYYY-MM-DD'T'HH:mm:ssZ", timeadd(timestamp(), "43800h")) # ~5 years

  lifecycle {
    ignore_changes = [end_date]
  }
}

# Grant admin consent for the Mail.Send application permission on the mail app
resource "azuread_app_role_assignment" "mail_send" {
  app_role_id         = local.msgraph_mail_send_role_id
  principal_object_id = azuread_service_principal.mail.object_id
  resource_object_id  = data.azuread_service_principal.msgraph.object_id
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
  account_kind             = "StorageV2"

  blob_properties {
    versioning_enabled = true
    delete_retention_policy {
      days = 30
    }
  }

  tags = local.tags

  lifecycle {
    ignore_changes = [tags]
  }
}

# Storage container for database seed JSON files: only my own identity and the
# app's should have any access

resource "azurerm_storage_container" "db_seed" {
  name                  = var.db_seed_container
  storage_account_id    = azurerm_storage_account.next_www_toastboy.id
  container_access_type = "private"
}

resource "azurerm_role_assignment" "toastboy" {
  scope                = azurerm_storage_account.next_www_toastboy.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = data.azuread_user.toastboy.object_id
}

resource "azurerm_role_assignment" "storage" {
  scope                = azurerm_storage_account.next_www_toastboy.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = azuread_service_principal.storage.object_id
}

# Storage for our public-accessible images

resource "azurerm_storage_container" "mugshots" {
  name                  = var.mugshots_container
  storage_account_id    = azurerm_storage_account.next_www_toastboy.id
  container_access_type = "private"
}

resource "azurerm_storage_container" "clubs" {
  name                  = var.clubs_container
  storage_account_id    = azurerm_storage_account.next_www_toastboy.id
  container_access_type = "private"
}

resource "azurerm_storage_container" "countries" {
  name                  = var.countries_container
  storage_account_id    = azurerm_storage_account.next_www_toastboy.id
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

  tags = local.tags

  lifecycle {
    ignore_changes = [tags]
  }
}

resource "azurerm_key_vault_secret" "auth_client_id" {
  name            = "auth-client-id"
  value           = azuread_application.auth.client_id
  key_vault_id    = azurerm_key_vault.next_www_toastboy.id
  expiration_date = timeadd(formatdate("YYYY-MM-DD'T'HH:mm:ssZ", timestamp()), "43800h") # ~5 years

  lifecycle {
    ignore_changes = [expiration_date, value]
  }
}

resource "azurerm_key_vault_secret" "auth_client_secret" {
  name            = "auth-client-secret"
  value           = azuread_service_principal_password.auth.value
  key_vault_id    = azurerm_key_vault.next_www_toastboy.id
  expiration_date = timeadd(formatdate("YYYY-MM-DD'T'HH:mm:ssZ", timestamp()), "43800h") # ~5 years

  lifecycle {
    ignore_changes = [expiration_date, value]
  }
}

resource "azurerm_key_vault_secret" "storage_client_id" {
  name            = "storage-client-id"
  value           = azuread_application.storage.client_id
  key_vault_id    = azurerm_key_vault.next_www_toastboy.id
  expiration_date = timeadd(formatdate("YYYY-MM-DD'T'HH:mm:ssZ", timestamp()), "43800h") # ~5 years

  lifecycle {
    ignore_changes = [expiration_date, value]
  }
}

resource "azurerm_key_vault_secret" "storage_client_secret" {
  name            = "storage-client-secret"
  value           = azuread_service_principal_password.storage.value
  key_vault_id    = azurerm_key_vault.next_www_toastboy.id
  expiration_date = timeadd(formatdate("YYYY-MM-DD'T'HH:mm:ssZ", timestamp()), "43800h") # ~5 years

  lifecycle {
    ignore_changes = [expiration_date, value]
  }
}

resource "azurerm_key_vault_secret" "mail_client_id" {
  name            = "mail-client-id"
  value           = azuread_application.mail.client_id
  key_vault_id    = azurerm_key_vault.next_www_toastboy.id
  expiration_date = timeadd(formatdate("YYYY-MM-DD'T'HH:mm:ssZ", timestamp()), "43800h") # ~5 years

  lifecycle {
    ignore_changes = [expiration_date, value]
  }
}

resource "azurerm_key_vault_secret" "mail_client_secret" {
  name            = "mail-client-secret"
  value           = azuread_service_principal_password.mail.value
  key_vault_id    = azurerm_key_vault.next_www_toastboy.id
  expiration_date = timeadd(formatdate("YYYY-MM-DD'T'HH:mm:ssZ", timestamp()), "43800h") # ~5 years

  lifecycle {
    ignore_changes = [expiration_date, value]
  }
}
