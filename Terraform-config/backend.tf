terraform {
  backend "s3" {
    bucket  = "soham-mule-og-bucket"
    key     = "eks/terraform.tfstate"
    region  = "eu-north-1"
    encrypt = true
  }
}
