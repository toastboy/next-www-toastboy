terraform {
  required_providers {
    azuread = {
      source  = "hashicorp/azuread"
      version = "~> 2.0"
    }

    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }

  cloud {
    organization = "toastboy"

    workspaces {
      name = "next-www-toastboy"
    }
  }
}

provider "azuread" {
  tenant_id = "6a192374-f4a3-4ab8-bcaf-7053c1f64ce9"
}

provider "azurerm" {
  tenant_id       = "6a192374-f4a3-4ab8-bcaf-7053c1f64ce9"
  subscription_id = "164b8c25-f844-4838-82c4-32d17635dcf0"

  features {}
}

data "azuread_client_config" "current" {}

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

  container_name              = "dbseeddata"
  service_principal_object_id = azuread_service_principal.next_www_toastboy_db_seed.object_id

  tags = {
    Terraform = "true"
  }
}

output "client_id" {
  value     = azuread_service_principal_password.next_www_toastboy_db_seed.service_principal_id
  sensitive = true
}

output "client_secret" {
  value     = azuread_service_principal_password.next_www_toastboy_db_seed.value
  sensitive = true
}
