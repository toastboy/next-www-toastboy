terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "3.88.0"
    }
  }

  cloud {
    organization = "toastboy"

    workspaces {
      name = "next-www-toastboy"
    }
  }
}

provider "azurerm" {
  tenant_id       = "6a192374-f4a3-4ab8-bcaf-7053c1f64ce9"
  subscription_id = "164b8c25-f844-4838-82c4-32d17635dcf0"

  features {}
}

module "db-seed" {
  source = "./modules/azure-blob-storage"

  container_name = "dbseeddata"

  tags = {
    Terraform = "true"
  }
}
