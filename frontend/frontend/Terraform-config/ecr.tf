resource "aws_ecrpublic_repository" "frontend" {
  repository_name = "Blog-project-fronend"
}

resource "aws_ecrpublic_repository" "backend" {
  repository_name = "Blog-project-backend"
}
